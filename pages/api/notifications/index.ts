// /api/notifications.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"; // 👈 ta fonction d'auth
import { Prisma } from "@prisma/client";

// Optionnel : fonction pour gérer les BigInt côté JSON
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const userId = Number(session.user.id);

  try {
    if (req.method === "GET") {
      const { vu } = req.query;    

      // Filtrage optionnel sur les notifications lues/non-lues
      const whereClause: Prisma.NotificationWhereInput = { userId };
      if (vu === "true") whereClause.vu = true;
      if (vu === "false") whereClause.vu = false;

      const notifications = await prisma.notification.findMany({
        where: whereClause,
        include: {
          emetteur: { select: { id: true, nom: true, prenom: true } },
        },
        orderBy: { dateNotification: "desc" },
      });

      const safeNotifications = serializeBigInt(notifications);

      return res.status(200).json({ data: safeNotifications });
    }

    if (req.method === "PATCH") {
      // Exemple : marquer une notification comme lue
      const { notificationId } = req.body;
      if (!notificationId) {
        return res.status(400).json({ error: "notificationId requis" });
      }

      const updated = await prisma.notification.update({
        where: { id: Number(notificationId) },
        data: { vu: true },
      });     

      const safeUpdated = serializeBigInt(updated);
      return res.status(200).json({ data: safeUpdated });
    }

    // --------------------- DELETE ---------------------
    if (req.method === "DELETE") {
      const { notificationId } = req.body;

      if (notificationId) {
        // Supprimer une notification spécifique
        const deleted = await prisma.notification.deleteMany({
          where: { id: Number(notificationId), userId },
        });
        return res.status(200).json({ message: "Notification supprimée", data: deleted });
      } else {
        // Supprimer toutes les notifications de l'utilisateur
        const deletedAll = await prisma.notification.deleteMany({
          where: { userId },
        });
        return res.status(200).json({ message: "Toutes les notifications supprimées", data: deletedAll });
      }
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur API /notifications:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
