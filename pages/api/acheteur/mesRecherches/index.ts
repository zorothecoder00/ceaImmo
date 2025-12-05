import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Categorie, Statut } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
     
  try {
    // Query params
    const {  
      search = "",
      categorie,
      statut,
      minPrix,
      maxPrix,
      minSurface,
      maxSurface,
      minChambres,
      maxChambres,
      latitude,
      longitude,
      radius, // en mètres          
      minNote,
      page = "1",
      limit = "10",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * take;

    // Champs autorisés pour le tri
    const allowedFields = ["createdAt", "prix", "surface", "nombreChambres", "note"];
    const safeField = allowedFields.includes(sortField as string)
      ? (sortField as string)
      : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    const sqlParams: (string | number)[] = [];
    let paramIndex = 1;

    const whereClauses: string[] = [];

    // 🔵 Recherche textuelle globale
    if (search) {
      whereClauses.push(`
        (p.nom ILIKE $${paramIndex}
        OR p.description ILIKE $${paramIndex}
        OR pr.nom ILIKE $${paramIndex}
        OR pr.prenom ILIKE $${paramIndex})
      `);
      sqlParams.push(`%${search}%`);
      paramIndex++;
    }

    // 🔵 Catégorie
    if (categorie) {
      const cat = Array.isArray(categorie) ? categorie[0] : categorie; // force string
      if (Object.values(Categorie).includes(cat as Categorie)) {
        whereClauses.push(`p.categorie = $${paramIndex}`);
        sqlParams.push(cat);
        paramIndex++;
      }
    }

    // 🔵 Statut
    if (statut) {
      const stat = Array.isArray(statut) ? statut[0] : statut; // force string
      if (Object.values(Statut).includes(stat as Statut)) {
        whereClauses.push(`p.statut = $${paramIndex}`);
        sqlParams.push(stat);
        paramIndex++;
      }
    }

    // 🔵 Prix
    if (minPrix) {
      whereClauses.push(`p.prix >= $${paramIndex}`);
      sqlParams.push(Number(minPrix));
      paramIndex++;
    }
    if (maxPrix) {
      whereClauses.push(`p.prix <= $${paramIndex}`);
      sqlParams.push(Number(maxPrix));
      paramIndex++;
    }

    // 🔵 Surface
    if (minSurface) {
      whereClauses.push(`p.surface >= $${paramIndex}`);
      sqlParams.push(Number(minSurface));
      paramIndex++;
    }
    if (maxSurface) {
      whereClauses.push(`p.surface <= $${paramIndex}`);
      sqlParams.push(Number(maxSurface));
      paramIndex++;
    }

    // 🔵 Chambres
    if (minChambres) {
      whereClauses.push(`p."nombreChambres" >= $${paramIndex}`);
      sqlParams.push(Number(minChambres));
      paramIndex++;
    }
    if (maxChambres) {
      whereClauses.push(`p."nombreChambres" <= $${paramIndex}`);
      sqlParams.push(Number(maxChambres));
      paramIndex++;
    }

    // ============================================
    // 🟧 FILTRE SPATIAL (distance en mètres)
    // ============================================
    let spatialSelect = `NULL AS distance`;
    let spatialWhere = ``;

    if (latitude && longitude && radius) {
      spatialSelect = `
        ST_Distance(
          g."geoPoint",
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)
        ) AS distance
      `;

      spatialWhere = `
        AND ST_DWithin(
          g."geoPoint",
          ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326),
          $${paramIndex + 2}
        )
      `;

      sqlParams.push(Number(longitude), Number(latitude), Number(radius));
      paramIndex += 3;
    }

    // ============================================
    // 🟥 WHERE FINAL
    // ============================================
    const whereSQL = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // ============================================
    // 🟩 SQL FINAL
    // ============================================
    const sql = `
      SELECT 
        p.id,
        p.nom,
        p.description,
        p.categorie,
        p.statut,
        p.prix,
        p.surface,
        p."nombreChambres",
        p."createdAt",
        pr.id AS "proprietaireId",
        pr.nom AS "proprietaireNom",
        pr.prenom AS "proprietairePrenom",
        g.latitude,
        g.longitude,
        ${spatialSelect},
        (
          SELECT json_agg(json_build_object('id', img.id, 'url', img.url, 'ordre', img.ordre))
          FROM "ProprieteImage" img 
          WHERE img."proprieteId" = p.id
          ORDER BY img.ordre ASC
        ) AS images
      FROM "Propriete" p  
      LEFT JOIN "Geolocalisation" g ON g."proprieteId" = p.id
      LEFT JOIN "Proprietaire" pr ON pr.id = p."proprietaireId"
      ${whereSQL}
      ${spatialWhere}
      ORDER BY ${safeField} ${order}
      LIMIT ${take} OFFSET ${skip};
    `;

    // Exécution de la requête
    const result = await prisma.$queryRawUnsafe(sql, ...sqlParams);

    return res.status(200).json({
      data: serializeBigInt(result),
      meta: {
        page: pageNum,
        limit: take,
      },
    });

  } catch (error) {
    console.error("Erreur API /recherches:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
