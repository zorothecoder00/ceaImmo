// /pages/api/proprietes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Categorie, Statut, Prisma } from "@prisma/client";

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
      geolocalisation,
      take,
      skip,
      search,
      orderBy = "createdAt", // par défaut
      order = "desc",        // par défaut
    } = req.query;

    // Construction dynamique du filtre
    const filters: Prisma.ProprieteWhereInput = {
      ...(categorie && Object.values(Categorie).includes(categorie as Categorie)
        ? { categorie: categorie as Categorie }
        : {}),
      ...(statut && Object.values(Statut).includes(statut as Statut)
        ? { statut: statut as Statut }
        : {}),
      ...(prixMin || prixMax
        ? {
            prix: {
              ...(prixMin ? { gte: Number(prixMin) } : {}),
              ...(prixMax ? { lte: Number(prixMax) } : {}),
            },
          }
        : {}),
      ...(surfaceMin || surfaceMax
        ? {
            surface: {
              ...(surfaceMin ? { gte: Number(surfaceMin) } : {}),
              ...(surfaceMax ? { lte: Number(surfaceMax) } : {}),
            },
          }
        : {}),
      ...(chambresMin || chambresMax
        ? {
            nombreChambres: {
              ...(chambresMin ? { gte: Number(chambresMin) } : {}),
              ...(chambresMax ? { lte: Number(chambresMax) } : {}),
            },
          }
        : {}),
      ...(geolocalisation
        ? {
            geolocalisation: {
              contains: String(geolocalisation),
              mode: "insensitive",
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { nom: { contains: String(search), mode: "insensitive" } },
              { description: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {}),
    };

    // sécuriser les champs triables
    const allowedOrderBy = ["createdAt", "prix", "surface"];
    const safeOrderBy = allowedOrderBy.includes(String(orderBy)) ? String(orderBy) : "createdAt";
    const safeOrder = String(order).toLowerCase() === "asc" ? "asc" : "desc";

    // pagination sécurisée
    const takeNumber = isNaN(Number(take)) ? 20 : Number(take);
    const skipNumber = isNaN(Number(skip)) ? 0 : Number(skip);

    const [proprietes, total] = await Promise.all([
      prisma.propriete.findMany({  
        where: filters,
        orderBy: { [safeOrderBy]: safeOrder },
        skip: skipNumber,
        take: takeNumber,     
      }),
      prisma.propriete.count({ where: filters }),
    ]);

    const safeProprietes = serializeBigInt(proprietes)

    return res.status(200).json({ total, data:  safeProprietes });
  } catch (error) {
    console.error("Erreur API proprietes:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
