import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Categorie, Statut, Prisma } from "@prisma/client";

// Typage minimal pour le résultat du $queryRaw sur Hotel
type HotelRaw = {
  id: number;
  proprieteId: number;
  nombreEtoiles: number;
  nombreChambresTotal: number;
  nombreVoyageursMax: number;
  politiqueAnnulation: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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

    let lat: number | undefined;
    let lng: number | undefined;
    let radius: number | undefined;

    if (destination && destination.latitude && destination.longitude) {
      lat = Number(destination.latitude);
      lng = Number(destination.longitude);
      radius = Number(destination.radius ?? 10000); // par défaut 10 km
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Coordonnées invalides." });
      }
    }

    // Construction dynamique de la requête SQL pour PostGIS
    let geoFilter = "";
    if (lat !== undefined && lng !== undefined && radius !== undefined) {
      geoFilter = `
        AND ST_DWithin(
          "Propriete"."geoPoint",
          ST_MakePoint(${lng}, ${lat})::geography,
          ${radius}
        )
      `;
    }

    // Filtre voyageurs
    const voyageursFilter = voyageurs ? `AND "nombreVoyageursMax" >= ${Number(voyageurs)}` : "";

    // Requête principale
    // ✅ Typage correct pour $queryRaw
    const hotels = (await prisma.$queryRaw<HotelRaw[]>`
      SELECT h.*
      FROM "Hotel" h
      INNER JOIN "Propriete" p ON p.id = h."proprieteId"
      WHERE p.categorie = 'HOTEL'
        AND p.statut = 'DISPONIBLE'
        ${Prisma.sql([geoFilter])}
        ${Prisma.sql([voyageursFilter])}
    `) as HotelRaw[];

    if (hotels.length === 0) {
      return res.status(404).json({ message: "Aucun hôtel trouvé à proximité." });
    }

    // Récupérer les relations via Prisma
    const hotelsWithRelations = await Promise.all(
      hotels.map(async (hotel) => {
        const hotelFull = await prisma.hotel.findUnique({
          where: { id: hotel.id },
          include: {
            propriete: {
              include: { images: true, geolocalisation: true },
            },
            chambres: true,
            disponibilites: true,
          },
        });
        return hotelFull;
      })
    );

    return res.status(200).json({
      success: true,
      total: hotelsWithRelations.length,
      data: hotelsWithRelations,
    });
  } catch (error) {
    console.error("Erreur recherche hôtel :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
