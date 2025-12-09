import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "@/lib/auth";
import { filtrageProprietes } from "@/lib/getDashboardAcheteur";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 Vérification de session utilisateur
  const session = await getAuthSession(req, res);

  if (!session?.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  // Fonction pour convertir BigInt
  function serializeBigInt<T>(obj: T): T {    
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  try {
    // 🟨 --- PREVIEW RECHERCHE ---  
    if (req.method === "POST" && req.query.preview === "true") {

      const {
        titre,
        categorie,
        statut,
        geolocalisation,
        radius,
        minPrix,
        maxPrix,
        minSurface,
        maxSurface,
        nombreChambres
      } = req.body;

      const resultats = await filtrageProprietes(
        session.user.id,
        titre ?? undefined,
        geolocalisation ?? undefined,
        radius,
        categorie ?? undefined,
        statut ?? undefined,
        minPrix ? Number(minPrix) : undefined,
        maxPrix ? Number(maxPrix) : undefined,
        minSurface ? Number(minSurface) : undefined,
        maxSurface ? Number(maxSurface) : undefined,
        nombreChambres ? Number(nombreChambres) : undefined
      );

       const safeData = serializeBigInt(resultats)

      return res.status(200).json({ resultats: safeData });
    }

    return res.status(405).json({ error: "Méthode non supportée" });

  } catch (error) {
    console.error("Erreur preview:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
