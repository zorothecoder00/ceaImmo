import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);

  // 🔒 Vérification de session + rôle
  if (!session || session.user.role !== "VENDEUR") {
    return res.status(403).json({ message: "Accès refusé." });
  }

  const userId = Number(session.user.id);

  try {
    switch (req.method) {
      case "GET": {
        // ✅ Récupérer la visibilité actuelle des annonces
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { visibiliteAnnonces: true },
        });

        // Protection au cas où l’utilisateur n’existe plus
        if (!user) {
          return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        return res.status(200).json({ data: user.visibiliteAnnonces });
      }

      case "PUT": {
        // ✅ Modifier la visibilité des annonces
        const { visibiliteAnnonces } = req.body;

        // Vérification du type
        if (typeof visibiliteAnnonces !== "boolean") {
          return res
            .status(400)
            .json({ message: "Valeur invalide pour visibiliteAnnonces." });
        }

        // Mise à jour
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { visibiliteAnnonces },
        });

        // (Optionnel) Log de l’action
        await prisma.log.create({
          data: {
            userId,
            action: visibiliteAnnonces
              ? "ACTIVATION_VISIBILITE_ANNONCES"
              : "MASQUAGE_VISIBILITE_ANNONCES",
          },
        });

        return res.status(200).json({
          message: visibiliteAnnonces
            ? "Vos annonces sont désormais publiques."
            : "Vos annonces sont désormais privées.",
          data: updatedUser.visibiliteAnnonces,
        });
      }

      default:
        return res.status(405).json({ message: "Méthode non autorisée." });
    }
  } catch (error) {
    console.error("Erreur API visibiliteAnnonce:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
  }
}
