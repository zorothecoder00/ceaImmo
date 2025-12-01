import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Type, ReservationStatut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";

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
    const {
      dateArrivee,
      dateDepart,
      nombreVoyageurs,
      proprieteId,
      chambreId,
    } = req.body;

    // Vérification des champs
    if (!dateArrivee || !dateDepart || !nombreVoyageurs) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    // Vérification structurelle
    if (!proprieteId && !chambreId) {
      return res.status(400).json({
        error: "Vous devez fournir proprieteId ou chambreId",
      });
    }

    const debut = new Date(dateArrivee);  
    const fin = new Date(dateDepart);

    // Création de la réservation
    const reservation = await prisma.reservation.create({
      data: {
        dateArrivee: debut,
        dateDepart: fin,
        nombreVoyageurs,
        type: Type.SEJOUR,
        statut: ReservationStatut.DEMANDEE,

        proprieteId: proprieteId ? Number(proprieteId) : null,
        chambreId: chambreId ? Number(chambreId) : null,

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
      message: "Réservation créée avec succès",
      data: reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la création de réservation:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
