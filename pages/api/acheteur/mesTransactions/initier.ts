import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";  
import { Mode, StatutTransaction, OffreStatut } from "@prisma/client";
import crypto from "crypto";
import { notify } from "@/services/notification.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }  

  try {
    const { offreId, acheteurId, mode } = req.body;

    if (!offreId || !acheteurId || !mode) {
      return res.status(400).json({ error: "offreId, acheteurId et mode sont requis" });
    }

    if (!Object.values(Mode).includes(mode)) {
      return res.status(400).json({ error: "Mode de paiement invalide" });
    }

    // Vérifier l'offre
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      include: { propriete: true, user: true },
    });

    if (!offre) return res.status(404).json({ error: "Offre introuvable" });

    if (offre.statut !== OffreStatut.ACCEPTEE) {
      return res.status(400).json({ error: "Cette offre n'est pas acceptée par le vendeur" });
    }

    // Vérifier qu'une transaction n'existe pas déjà
    const existing = await prisma.transaction.findUnique({
      where: { offreId },
    });

    if (existing) {
      return res.status(400).json({ error: "Transaction déjà initiée pour cette offre" });
    }

    // Référence unique
    const reference = `TX-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

    // Création de la transaction
    const transaction = await prisma.transaction.create({
      data: {
        offreId: offre.id,
        amount: BigInt(offre.montant),     // montant de l'offre
        currency: "XOF",
        mode: mode,
        statut: StatutTransaction.EN_ATTENTE,
        reference,
        userId: acheteurId,               // acheteur
        agentId: offre.propriete.proprietaireId, // vendeur
      },
    });

    const vendeurId = offre.propriete.proprietaireId;

    // 🔔 Notification au vendeur/propriétaire
    if (vendeurId) {
      await notify({
        type: "PAIEMENT_INITIE",
        recepteurId: vendeurId, // ✅ garanti number
        emetteurId: acheteurId,
        data: {
          type: "PAIEMENT_INITIE",
          montant: offre.montant,
        },
        lien: `/dashboard/vendeur/offres`,
      });
    }

    return res.status(201).json({
      message: "Transaction initiée. En attente de paiement.",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur", details: error });
  }
}
