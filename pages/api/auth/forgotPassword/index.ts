// pages/api/auth/forgotPassword
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, method } = req.body;

    if (!email && method === "email") return res.status(400).json({ error: "Email requis" });

    if (method === "email") {
      console.log("🔑 Reset password demandé pour:", email);
      return res.status(200).json({ message: "Email envoyé" });
    }

    if (method === "google") {
      return res.status(200).json({ redirectUrl: "/api/auth/google" });
    }

    return res.status(400).json({ error: "Méthode invalide" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur interne" });
  }
}
