// /pages/api/proprietes/[id]/visiteVirtuelle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { id } = req.query;
    const { lien } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID invalide" });
    }

    if (!lien || typeof lien !== "string") {
      return res.status(400).json({ error: "Lien de visite virtuelle requis" });
    }

    // Vérifier si la propriété existe
    const propriete = await prisma.propriete.findUnique({
      where: { id: Number(id) },
    });

    if (!propriete) {
      return res.status(404).json({ error: "Propriété non trouvée" });
    }

    // Mise à jour du champ `media` (utilisé pour stocker le lien)
    const updatedPropriete = await prisma.propriete.update({
      where: { id: Number(id) },
      data: { media: lien },
    });

    return res.status(200).json({
      message: "Lien de visite virtuelle mis à jour avec succès",
      propriete: updatedPropriete,
    });
  } catch (error) {
    console.error("Erreur API propriete/:id/visite-virtuelle:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
