import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
 
  try {  
    const session = await getAuthSession(req, res);
    if (!session) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const userId = session?.user?.id

    const { nom, prenom, email, photo } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { nom, prenom, email, photo },
    });

    return res.status(200).json({
      message: "Profil mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
}
