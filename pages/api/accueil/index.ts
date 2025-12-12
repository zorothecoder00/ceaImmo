import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { Categorie } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    // Empêche l'erreur BigInt → JSON
    function serializeBigInt<T>(obj: T): T {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      )
    }

    // Lecture du JSON reçu dans ?search={}
    const searchStr = req.query.search as string || "{}"
    console.log("=== RAW SEARCH STRING ===", searchStr)
    const search = JSON.parse(searchStr)
    console.log("=== PARSED SEARCH OBJECT ===", search)

    const { nom, categorie, prixMin, prixMax, latitude, longitude, radius } = search

    // ========================================
    //  🟦 1) CONSTRUCTION DES CLAUSES SQL
    // ========================================

    const whereClauses: string[] = []
    const params: unknown[] = []
    let paramIndex = 1

    // 🔵 NOM
    if (nom) {
      whereClauses.push(`p.nom ILIKE $${paramIndex++}`)
      params.push(`%${nom}%`)
    }

    // 🔵 CATEGORIE ENUM
    if (categorie) {
      const match = Object.values(Categorie).filter((c) =>
        c.toLowerCase().includes(String(categorie).toLowerCase())
      )

      if (match.length > 0) {
        whereClauses.push(`p.categorie = ANY($${paramIndex++})`)
        params.push(match)
      }
    }

    // 🔵 PRIX MIN
    if (prixMin) {
      whereClauses.push(`p.prix >= $${paramIndex++}`)
      params.push(Number(prixMin))
    }

    // 🔵 PRIX MAX
    if (prixMax) {
      whereClauses.push(`p.prix <= $${paramIndex++}`)
      params.push(Number(prixMax))
    }

    // 🔵 FILTRAGE SPATIAL
    let spatialSelect = "NULL AS distance"; // initialisation par défaut

    if (latitude && longitude && radius) {
      spatialSelect = `
        ST_Distance(
          geo."geoPoint",
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography
        ) AS distance
      `;
      whereClauses.push(`
        ST_Distance(
          geo."geoPoint",
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography
        ) <= $${paramIndex + 2}
      `);
      params.push(Number(longitude), Number(latitude), Number(radius));
      paramIndex += 3;
    }


    // 🔵 WHERE FINAL
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""
    
    // 🔵 Distance calculée (pour tri)
    let distanceSelect = "NULL AS distance"
    let orderSQL = `ORDER BY p."createdAt" DESC`
    if (latitude && longitude) {
      distanceSelect = `
        ST_Distance(
          geo."geoPoint",
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      `
      orderSQL = "ORDER BY distance ASC"
    }

    // ========================================
    // 3) SQL FINAL
    // ========================================
    const sql = `
      SELECT
        p.id,
        p.nom,
        p.categorie,
        p.prix,
        p."visiteVirtuelle",
        json_build_object(
          'latitude', geo.latitude,
          'longitude', geo.longitude
        ) AS geolocalisation,
        (
          SELECT json_agg(
            json_build_object(
              'id', img.id,
              'url', img.url,
              'ordre', img.ordre
            ) ORDER BY img.ordre
          )     
          FROM "ProprieteImage" img
          WHERE img."proprieteId" = p.id
        ) AS images,
        ${distanceSelect}
      FROM "Propriete" p
      LEFT JOIN "Geolocalisation" geo
        ON geo."proprieteId" = p.id
      ${whereSQL}
      ${orderSQL}
      LIMIT 4;
    `
    console.log("=== FINAL SQL ===\n", sql)

    const results = await prisma.$queryRawUnsafe(sql, ...params)

    return res.status(200).json({
      data: serializeBigInt(results),
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Erreur serveur", error: e })
  }
}
