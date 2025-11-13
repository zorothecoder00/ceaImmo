import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";    

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "ID d'hôtel requis" });
  }

  const hotelId = parseInt(id, 10);
  if (isNaN(hotelId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    // 🔹 Récupération de l'hôtel avec tous les détails
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        propriete: {
          include: {
            images: true,
            avis: { include: { user: true } },
            favoris: true,
            chambres: {
              include: {
                reservations: {
                  include: { user: true },
                },
              },
            },
          },
        },
        chambres: {
          include: {
            reservations: { include: { user: true } },
          },
        },
        disponibilites: true,
      },
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hôtel non trouvé" });
    }

    return res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    console.error("Erreur récupération hôtel:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
