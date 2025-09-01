// /api/send-otp.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function POST(req: Request) {
  const { phone } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Ici tu stockes otp + phone + expiration en DB ou cache

  await client.messages.create({
    body: `Votre code de réinitialisation : ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
   
  return NextResponse.json({ message: "OTP envoyé" });
}
