import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "@/lib/auth";
import { sauvegarderRecherche, getRecherchesSauvegardees } from "@/lib/getDashboardAcheteur";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 Vérification de session utilisateur
  const session = await getAuthSession(req, res);
   
  if (!session?.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  try {
    // 🔹 Récupération des recherches sauvegardées
    if (req.method === "GET") {
      const data = await getRecherchesSauvegardees(session?.user?.id);

      const safeData = serializeBigInt(data)
      return res.status(200).json(safeData);
    }

    // 🔹 Sauvegarde d'une nouvelle recherche
    if (req.method === "POST") {
      const body = req.body;
      const data = await sauvegarderRecherche(session?.user?.id, body);

      const safeData = serializeBigInt(data)
      return res.status(201).json(safeData);
    }

    // 🔹 Méthodes non autorisées
    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur API /mesRecherchesSauvegardees :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
