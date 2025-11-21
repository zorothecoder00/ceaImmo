import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";  
import { StatutTransaction, Statut } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { transactionId, acheteurId, provider, providerTransactionId } = req.body;

    if (!transactionId || !acheteurId) {
      return res.status(400).json({ error: "transactionId et acheteurId requis" });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { 
        offre: { include: { propriete: true } } 
      },
    });


    if (!transaction) return res.status(404).json({ error: "Transaction introuvable" });

    if (transaction.userId !== acheteurId) {
      return res.status(403).json({ error: "Vous n'êtes pas l'acheteur concerné" });
    }

    if (transaction.statut !== StatutTransaction.EN_ATTENTE) {
      return res.status(400).json({ error: "La transaction ne peut pas être finalisée" });
    }

    const offre = transaction.offre;
    if (!offre) return res.status(500).json({ error: "Offre introuvable" });

    const propriete = offre.propriete;

    if (!propriete) {
      return res.status(500).json({ error: "Propriété introuvable" });
    }

    // 🚨 récupérer l'ancien propriétaire AVANT transfert
    const ancienProprietaireId = propriete.proprietaireId;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Marquer la transaction comme payée
      const paid = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          statut: StatutTransaction.REUSSIE,
          paidAt: new Date(),
          provider: provider ?? transaction.provider,
          providerTransactionId: providerTransactionId ?? transaction.providerTransactionId,
        },
      });

      // 2. Transférer la propriété
      await tx.propriete.update({
        where: { id: propriete.id },     
        data: {
          proprietaireId: acheteurId,
          statut: Statut.VENDU,
        },
      });

      return paid;
    });

    return res.status(200).json({
      message: "Transaction finalisée et propriété transférée.",
      ancienProprietaireId, // 👈 envoyé dans la réponse
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur", details: error });
  }
}
