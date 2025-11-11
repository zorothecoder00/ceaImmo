// pages/api/reservationsHotel.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Categorie, Statut, Type } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";

// Type pour une chambre avec ses réservations
type ChambreDisponible = {
  id: number;
  nom: string;
  capacite: number;
  disponible: boolean;
  proprieteId: number;
  reservations: { dateArrivee: Date; dateDepart: Date }[];
};

// Type pour un hôtel avec ses chambres
type HotelAvecChambres = {
  id: number;
  nom: string;
  geolocalisation: string;
  chambres: ChambreDisponible[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const session = await getAuthSession(req, res);
  if (!session) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const { destination, dateArrivee, dateDepart, nombreVoyageurs } = req.body;

    if (!destination || !dateArrivee || !dateDepart || !nombreVoyageurs) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const debut = new Date(dateArrivee);
    const fin = new Date(dateDepart);

    // 🔹 Récupérer les hôtels avec leurs chambres et les réservations
    const hotels: HotelAvecChambres[] = await prisma.propriete.findMany({
      where: {
        categorie: Categorie.HOTEL,
        statut: Statut.DISPONIBLE,
        geolocalisation: { contains: destination, mode: "insensitive" },
      },
      include: {
        chambres: {
          include: {
            reservations: true,
          },
        },
      },
    });

    if (hotels.length === 0) {
      return res.status(404).json({ message: "Aucun hôtel trouvé à cette destination" });
    }

    // 🔹 Chercher une chambre disponible
    let chambreDisponible: ChambreDisponible | null = null;
    let hotelChoisi: HotelAvecChambres | null = null;

    for (const hotel of hotels) {
      const chambre = hotel.chambres.find((ch) => {
        if (!ch.disponible || ch.capacite < nombreVoyageurs) return false;

        // Vérifier si la chambre est libre sur la période demandée
        const conflit = ch.reservations.some(
          (r) => debut < r.dateDepart && fin > r.dateArrivee
        );

        return !conflit;
      });

      if (chambre) {
        chambreDisponible = chambre;
        hotelChoisi = hotel;
        break;
      }
    }

    if (!chambreDisponible || !hotelChoisi) {
      return res.status(400).json({ message: "Aucune chambre disponible pour ce nombre de voyageurs et ces dates" });
    }

    // 🔹 Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        dateArrivee: debut,
        dateDepart: fin,
        nombreVoyageurs,
        type: Type.SEJOUR,
        proprieteId: hotelChoisi.id,
        chambreId: chambreDisponible.id,
        userId: userId,
      },
      include: {
        propriete: true,
        chambre: true,
        user: true,
      },
    });

    return res.status(201).json({
      success: true,
      reservation,
      hotel: hotelChoisi,
      chambre: chambreDisponible,
    });

  } catch (error) {
    console.error("Erreur réservation hôtel:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
