import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }  
    
  try {
    const { destination, arrivee, depart, voyageurs } = req.body;

    if (!voyageurs) return res.status(400).json({ error: "Nombre de voyageurs manquant." });
    if (!arrivee || !depart) return res.status(400).json({ error: "Dates manquantes." });

    const dateArrivee = new Date(arrivee);
    const dateDepart = new Date(depart);

    if (isNaN(dateArrivee.getTime()) || isNaN(dateDepart.getTime())) {
      return res.status(400).json({ error: "Dates invalides." });
    }

    if (dateArrivee >= dateDepart) {
      return res.status(400).json({ error: "La date d'arrivée doit être avant la date de départ." });
    }
    
    if (!destination?.latitude || !destination?.longitude) {
      return res.status(400).json({ error: "Destination invalide." });
    }

    const lat = Number(destination.latitude);
    const lng = Number(destination.longitude);
    const radius = Number(destination.radius ?? 10000);

    const dateArriveeISO = dateArrivee.toISOString();
    const dateDepartISO = dateDepart.toISOString();

    const hotels = await prisma.$queryRaw<{
      id: number;
      nom: string;   
      latitude: number;
      longitude: number;
      distance: number;
    }[]>`
    SELECT 
      h.id,
      p.nom,
      g.latitude,
      g.longitude,
      ST_Distance(
        ST_MakePoint(${lng}, ${lat})::geography,
        ST_MakePoint(g.longitude, g.latitude)::geography
      ) AS distance
    FROM "Hotel" h
    JOIN "Propriete" p ON p.id = h."proprieteId"
    JOIN "Geolocalisation" g ON g."proprieteId" = p.id
    WHERE 
      h."nombreVoyageursMax" >= ${voyageurs}
      AND ST_DWithin(
        ST_MakePoint(${lng}, ${lat})::geography,
        ST_MakePoint(g.longitude, g.latitude)::geography,
        ${radius}
      )
      AND (
        SELECT COALESCE(SUM(c.capacite), 0)
        FROM "Chambre" c
        WHERE c."hotelId" = h.id
          AND NOT EXISTS (
            SELECT 1
            FROM "Reservation" r
            WHERE r."chambreId" = c.id
              AND r."dateArrivee" < ${dateDepartISO}::timestamp
              AND r."dateDepart" > ${dateArriveeISO}::timestamp
          )
      ) >= ${voyageurs}
    ORDER BY distance ASC;
    `;

    if (hotels.length === 0) return res.status(404).json({ message: "Aucun hôtel disponible." });

    const hotelsWithRelations = await Promise.all(
      hotels.map(async (hotel) => {
        const fullHotel = await prisma.hotel.findUnique({
          where: { id: hotel.id },
          include: {
            propriete: { include: { images: true, geolocalisation: true } },
            chambres: { include: { reservations: true } },
          },
        });   

        return {
          ...fullHotel!,
          distance: hotel.distance, // 👉 On remet la distance dans la réponse !
        };
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
