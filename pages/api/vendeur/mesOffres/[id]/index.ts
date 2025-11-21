import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { OffreStatut, Statut, StatutTransaction, Mode } from "@prisma/client";
import { getAuthSession } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session = await getAuthSession(req, res)    

  const { id } = req.query;
  const offreId = parseInt(id as string);

  if (isNaN(offreId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  switch (req.method) {   
    case "GET":
      try {
        const offre = await prisma.offre.findUnique({
          where: { id: offreId },
          include: { propriete: true, user: true },
        });

        if (!offre) return res.status(404).json({ error: "Offre introuvable" });

        const safeOffre = serializeBigInt(offre)

        return res.status(200).json({ data: safeOffre });
      } catch (error) {
        return res.status(500).json({ error: "Erreur serveur", details: error });
      }

    case "PATCH":
      try {
        const { action, montant, message } = req.body;

        // --------------------------------------------------------------------
        // 🔁 Modifier l’offre
        // --------------------------------------------------------------------
        if (action === "modifier") {
          const updated = await prisma.offre.update({
            where: { id: offreId },
            data: {
              ...(montant !== undefined && { montant }),
              ...(message !== undefined && { message }),
              statut: OffreStatut.EN_ATTENTE,
            },
          });

          const safeUpdated = serializeBigInt(updated)

          return res.status(200).json({ message: "Offre modifiée", data: safeUpdated });
        }

        // --------------------------------------------------------------------
        // 🔁 Retirer l’offre
        // --------------------------------------------------------------------
        if (action === "retirer") {
          const updated = await prisma.offre.update({
            where: { id: offreId },
            data: { statut: OffreStatut.REFUSEE },
          });

          const safeUpdated = serializeBigInt(updated)

          return res.status(200).json({ message: "Offre retirée", data: safeUpdated });
        }

        // --------------------------------------------------------------------
        // ✅ Accepter l’offre (NOUVELLE VERSION)
        // ❗ ICI on n’effectue PAS de transaction et PAS de transfert
        // --------------------------------------------------------------------
        if (action === "accepter") {
          const offre = await prisma.offre.findUnique({
            where: { id: offreId },
            include: { propriete: true, user: true },
          });

          if (!offre) return res.status(404).json({ error: "Offre introuvable" });
          if (!offre.propriete) return res.status(500).json({ error: "Propriété introuvable" });

          // ❗ Vérifier que le vendeur connecté est bien propriétaire (à compléter)
          console.log("SESSION =", session);
          console.log("OFFRE =", offre);

          if (Number(session?.user?.id) !== offre.propriete.proprietaireId)
            return res.status(403).json({ error: "Non autorisé" });

   
          const proprieteId = offre.propriete.id;         

          const result = await prisma.$transaction(async (tx) => {
            // A) Accepter l’offre
            const accepted = await tx.offre.update({
              where: { id: offreId },
              data: { statut: OffreStatut.ACCEPTEE, updatedAt: new Date() },
            });

            // B) Marquer la propriété comme réser vée (aucun transfert de propriétaire)
            const updatedProperty = await tx.propriete.update({
              where: { id: proprieteId },
              data: {
                statut: Statut.RESERVE, // ou Statut.EN_NEGOCIATION
              },
            });

            // C) Créer une transaction "EN_ATTENTE" pour l’acheteur
            const reference = `TX-${Date.now()}-${Math.floor(Math.random()*9999)}`;

            const transaction = await tx.transaction.create({
              data: {
                amount: BigInt(offre.montant),       // le montant de l’offre acceptée
                mode: Mode.CASH,                     // ou ce que tu veux
                reference,      // ou ton propre générateur
                statut: StatutTransaction.EN_ATTENTE,
                offreId: offre.id,
                userId: offre.userId                 // (optionnel)
              }
            });

            // D) Refuser les autres offres EN_ATTENTE
            await tx.offre.updateMany({
              where: {
                proprieteId,
                id: { not: offreId },
                statut: OffreStatut.EN_ATTENTE,
              },
              data: { statut: OffreStatut.REFUSEE, updatedAt: new Date() },
            });

            return { accepted, updatedProperty, transaction };
          });

          const safeResult = serializeBigInt(result)

          return res.status(200).json({
            message: "Offre acceptée. Propriété réservée en attente de paiement.",
            data: safeResult,
          });
        }

        return res.status(400).json({ error: "Action invalide" });
      } catch (error) {
        console.error("🔥 ERREUR API OFFRE VENDEUR =", error);
        return res.status(500).json({ error: "Erreur serveur", details: String(error) });
      }

    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
