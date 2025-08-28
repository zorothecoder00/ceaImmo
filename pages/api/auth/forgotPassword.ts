// src/app/api/auth/forgotPassword/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, method } = await req.json();

    if (!email && method === "email") {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    if (method === "email") {
      // 👉 Ici tu mets la logique pour envoyer un email
      // Ex: via Nodemailer ou ton provider externe
      console.log("🔑 Reset password demandé pour:", email);

      return NextResponse.json(
        { message: "Email envoyé avec succès" },
        { status: 200 }
      );
    }

    if (method === "google") {
      // 👉 Ici tu peux rediriger vers la page de connexion Google
      return NextResponse.json(
        { redirectUrl: "/api/auth/google" }, // Exemple
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Méthode invalide" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}
