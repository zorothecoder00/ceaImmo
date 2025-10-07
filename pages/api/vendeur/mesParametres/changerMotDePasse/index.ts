import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAuthSession } from "@/lib/auth";
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {  
    const session = await getAuthSession(req, res);    
    if (!session) {
      return res.status(401).json({ error: "Non autorisé" });
    } 

    const userId = session?.user?.id

    const { ancienPassword, nouveauPassword } = req.body;

    const userData = await prisma.user.findUnique({ where: { id: Number(userId) } });

    const isValid = await bcrypt.compare(ancienPassword, userData?.password || "");
    if (!isValid) {
      return res.status(400).json({ error: "Mot de passe actuel incorrect" });
    }

    const hashed = await bcrypt.hash(nouveauPassword, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashed },
    });

    return res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors du changement de mot de passe" });
  }
}
