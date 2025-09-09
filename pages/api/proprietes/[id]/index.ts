// /pages/api/proprietes/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const propriete = await prisma.propriete.findUnique({
      where: { id: Number(id) },
      include: {
        proprietaire: {
          select: { id: true, nom: true, prenom: true, email: true, photo: true },
        },
        images: {
          select: { id: true, url: true, ordre: true },
          orderBy: { ordre: "asc" }, // 🔥 affiche les images dans le bon ordre
        },
        chambres: {
          select: { id: true, nom: true, prixParNuit: true, capacite: true, disponible: true },
        },
        reservations: {
          select: {
            id: true,
            dateArrivee: true,
            dateDepart: true,
            nombreVoyageurs: true,
            type: true,
            user: { select: { id: true, nom: true, prenom: true } },
          },
        },
        offres: {
          select: {
            id: true,
            montant: true,
            statut: true,
            user: { select: { id: true, nom: true, prenom: true } },
          },
        },
        favoris: {
          select: {
            id: true,
            user: { select: { id: true, nom: true, prenom: true } },
          },
        },
      },
    });

    if (!propriete) {
      return res.status(404).json({ error: "Propriété non trouvée" });
    }

    return res.status(200).json({ data: propriete });
  } catch (error) {
    console.error("Erreur API propriete/:id:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
