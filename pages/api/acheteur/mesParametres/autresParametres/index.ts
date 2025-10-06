import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    const session = await getAuthSession(req, res);  
    if (!session) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const userId = session?.user?.id

    const { confidentialite, theme, langue } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        confidentialite,
        theme,
        langue,
      },
    });

    return res.status(200).json({
      message: "Paramètres mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour des paramètres" });
  }
}
