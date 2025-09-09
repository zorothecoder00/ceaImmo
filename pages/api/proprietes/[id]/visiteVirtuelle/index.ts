// /pages/api/proprietes/[id]/visiteVirtuelle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Autoriser uniquement PUT
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { id } = req.query;
    const { lien } = req.body;

    // Validation de l'ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID invalide" });
    }

    // Validation du lien
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

    // Mettre à jour le lien de visite virtuelle
    const updatedPropriete = await prisma.propriete.update({
      where: { id: Number(id) },
      data: { visiteVirtuelle: lien },
      include: {
        images: { select: { id: true, url: true, ordre: true }, orderBy: { ordre: "asc" } },
        proprietaire: { select: { id: true, nom: true, prenom: true, email: true, photo: true } },
      },
    });

    return res.status(200).json({
      message: "Lien de visite virtuelle mis à jour avec succès",
      data: updatedPropriete,
    });
  } catch (error) {
    console.error("Erreur API propriete/:id/visite-virtuelle:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
