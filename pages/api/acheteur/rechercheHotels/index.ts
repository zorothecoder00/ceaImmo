// pages/api/acheteur/rechercheHotel.ts

import type { NextApiRequest, NextApiResponse } from "next";  
import prisma from "@/lib/prisma";   
import { Categorie, Statut, Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });   
  }

  try {
    const { destination, arrivee, depart, voyageurs } = req.body;

    const dateArrivee = new Date(arrivee);
    const dateDepart = new Date(depart);

    if (dateArrivee >= dateDepart) {
      return res.status(400).json({ error: "Dates invalides." });
    }

    // Construction de la condition pour la propriété
    const proprieteWhere: Prisma.ProprieteWhereInput = {
      categorie: Categorie.HOTEL,
      statut: Statut.DISPONIBLE,
      ...(destination ? { geolocalisation: { contains: destination, mode: "insensitive" } } : {}),
    };

    // Construction du filtre principal
    const where: Prisma.HotelWhereInput = {
      propriete: proprieteWhere,
      ...(voyageurs ? { nombreVoyageursMax: { gte: voyageurs } } : {}),
      ...(arrivee && depart
        ? {
            disponibilites: {
              some: {
                disponible: true,
                startDate: { lte: dateArrivee },
                endDate: { gte: dateDepart },
              },
            },
          }
        : {}),
    };

    // 1️⃣ Recherche de toutes les propriétés de type HOTEL à cette destination
    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        propriete: {
          include: {
            images: true,
          }
        },
        chambres: true,
        disponibilites: true,
      },
    });

    if (hotels.length === 0) {
      return res.status(404).json({ message: "Aucun hôtel trouvé avec ces filtres." });
    }

    const hotelsWithDisponibilite = hotels.map(hotel => ({
      ...hotel,
      disponible: hotel.disponibilites.some(d => d.disponible)
    }));

    return res.status(200).json({
      success: true,
      total: hotelsWithDisponibilite.length,
      data: hotelsWithDisponibilite,
    });

  } catch (error) {
    console.error("Erreur recherche hôtel :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
