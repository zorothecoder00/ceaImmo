// pages/api/send-otp
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Le numéro de téléphone est requis" });
    }

    // Génère un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Ici tu peux stocker otp + phone + expiration en DB ou cache

    await client.messages.create({
      body: `Votre code de réinitialisation : ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    return res.status(200).json({ message: "OTP envoyé", otp }); // tu peux retirer otp si tu veux
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ error: "Erreur interne" });
  }
}
