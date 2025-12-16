import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Categorie, Statut, Prisma } from "@prisma/client";

// Type pour la propriété retournée par la requête SQL
type ProprieteSQL = {
  id: number;
  nom: string;
  description: string;
  categorie: Categorie;
  statut: Statut;
  prix: string;      // stocké en bigint -> string après JSON.parse
  surface: number;
  nombreChambres: number;
  visiteVirtuelle: string | null;
  proprietaireId: number;
  createdAt: Date;
  updatedAt: Date;
  // ajouter d'autres champs si nécessaire
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    function serializeBigInt<T>(obj: T): T {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }

    const {
      categorie,
      prixMin,
      prixMax,
      surfaceMin,
      surfaceMax,
      chambresMin,
      chambresMax,
      statut,
      geolocalisationLat,
      geolocalisationLng,
      radius,
      take,
      skip,
      search,
      orderBy = "createdAt",
      order = "desc",
    } = req.query;

    const takeNumber = isNaN(Number(take)) ? 20 : Number(take);
    const skipNumber = isNaN(Number(skip)) ? 0 : Number(skip);

    const allowedOrderBy = ["createdAt", "prix", "surface"];
    const safeOrderBy = allowedOrderBy.includes(String(orderBy)) ? String(orderBy) : "createdAt";
    const safeOrder = String(order).toLowerCase() === "asc" ? "ASC" : "DESC";

    const filters: string[] = [];
    const params: (string | number)[] = [];

    if (categorie && Object.values(Categorie).includes((Array.isArray(categorie) ? categorie[0] : categorie) as Categorie)) {
      const cat = Array.isArray(categorie) ? categorie[0] : categorie;
      filters.push(`categorie = $${params.length + 1}`);
      params.push(cat);
    }

    if (statut && Object.values(Statut).includes((Array.isArray(statut) ? statut[0] : statut) as Statut)) {
      const st = Array.isArray(statut) ? statut[0] : statut;
      filters.push(`statut = $${params.length + 1}`);
      params.push(st);
    }

    if (prixMin) {
      filters.push(`prix >= $${params.length + 1}`);
      params.push(Number(prixMin));
    }

    if (prixMax) {
      filters.push(`prix <= $${params.length + 1}`);
      params.push(Number(prixMax));
    }

    if (surfaceMin) {
      filters.push(`surface >= $${params.length + 1}`);
      params.push(Number(surfaceMin));
    }

    if (surfaceMax) {
      filters.push(`surface <= $${params.length + 1}`);
      params.push(Number(surfaceMax));
    }

    if (chambresMin) {
      filters.push(`nombreChambres >= $${params.length + 1}`);
      params.push(Number(chambresMin));
    }

    if (chambresMax) {
      filters.push(`nombreChambres <= $${params.length + 1}`);
      params.push(Number(chambresMax));
    }

    if (search) {
      filters.push(`(nom ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    let geoFilter = "";
    if (geolocalisationLat && geolocalisationLng) {
      const lat = Number(geolocalisationLat);
      const lng = Number(geolocalisationLng);
      const dist = radius ? Number(radius) : 10000;
      geoFilter = `ST_DWithin("geolocalisation"."geopoint", ST_MakePoint(${lng}, ${lat})::geography, ${dist})`;
    }

    const whereClause = [...filters];
    if (geoFilter) whereClause.push(geoFilter);
    const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    // ✅ Typé correctement au lieu de any
    const proprietes = await prisma.$queryRaw<ProprieteSQL[]>(
      Prisma.sql`
        SELECT * FROM "Propriete"
        ${whereClause.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereClause.map((f, i) => Prisma.raw(f)))}` : Prisma.sql``}
        ORDER BY ${Prisma.raw(safeOrderBy)} ${Prisma.raw(safeOrder)}
        LIMIT ${takeNumber}
        OFFSET ${skipNumber}
      `
    );

    const totalResult = await prisma.$queryRaw<{ count: string }[]>(
      Prisma.sql`
        SELECT COUNT(*) AS count FROM "Propriete"
        ${whereClause.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereClause.map((f, i) => Prisma.raw(f)))}` : Prisma.sql``}
      `
    );


    const total = totalResult[0] ? Number(totalResult[0].count) : 0;
    const safeProprietes = serializeBigInt(proprietes);

    return res.status(200).json({
      total,
      page: Math.floor(skipNumber / takeNumber) + 1,
      limit: takeNumber,
      orderBy: safeOrderBy,
      order: safeOrder.toLowerCase(),
      data: safeProprietes,
    });
  } catch (error) {
    console.error("Erreur API proprietes:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
