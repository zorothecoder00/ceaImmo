// pages/api/vendeur/mesHotels.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";

interface ProprieteInput {
  nom: string;
  description?: string;
  categorie: Categorie;
  statut?: Statut;
  geolocalisation: { lat: number; lng: number }; // ✅ Corrigé
  nombreChambres: number;
  visiteVirtuelle?: string;
  prix?: string;
  surface?: string;
  imageUrls?: string[];
}

interface ChambreInput {
  nom: string;
  description?: string;
  prixParNuit: number;
  capacite: number;
  disponible?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getAuthSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const proprietaireId = Number(session.user.id);

    const serializeBigInt = <T,>(obj: T): T =>
      JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

    /* ===================== GET ===================== */
    if (req.method === "GET") {
      const hotels = await prisma.hotel.findMany({
        where: {
          propriete: { proprietaireId },
        },
        include: {
          propriete: { include: { images: true, geolocalisation: true } },
          chambres: true,
          disponibilites: true,
        },
      });

      return res.status(200).json({ data: serializeBigInt(hotels) });
    }

    /* ===================== POST ===================== */
    if (req.method === "POST") {
      const {
        propriete,
        nombreEtoiles,
        nombreChambresTotal,
        nombreVoyageursMax,
        politiqueAnnulation,
        chambres = [],
      }: {
        propriete: ProprieteInput;
        nombreEtoiles?: number;
        nombreChambresTotal?: number;
        nombreVoyageursMax?: number;   
        politiqueAnnulation?: string;
        chambres?: ChambreInput[];
      } = req.body;

      /* ----- Validations de base ----- */
      if (!propriete || propriete.categorie !== Categorie.HOTEL) {
        return res.status(400).json({ message: "Propriété de type HOTEL requise" });
      }

      if (
        !propriete.geolocalisation ||
        typeof propriete.geolocalisation.lat === "undefined" ||
        typeof propriete.geolocalisation.lng === "undefined"
      ) {
        return res.status(400).json({
          message: "Géolocalisation invalide : { lat, lng } requis",
        });
      }

      /* ----- Calculs ----- */
      const totalChambres = chambres.length;
      const maxVoyageurs =
        chambres.reduce((acc, ch) => acc + (ch.capacite || 0), 0) || 1;

      /* ----- Création de la propriété ----- */
      const proprieteCreated = await prisma.propriete.create({
        data: {
          nom: propriete.nom,
          description: propriete.description ?? "",
          categorie: Categorie.HOTEL,
          statut: propriete.statut ?? Statut.DISPONIBLE,
          proprietaireId,
          visiteVirtuelle: propriete.visiteVirtuelle ?? null,
          prix: propriete.prix ? BigInt(Number(propriete.prix)) : undefined,
          surface: propriete.surface ? BigInt(Number(propriete.surface)) : undefined,

          geolocalisation: {
            create: {
              latitude: Number(propriete.geolocalisation.lat),
              longitude: Number(propriete.geolocalisation.lng),
            },
          },

          images: propriete.imageUrls?.length
            ? {
                create: propriete.imageUrls.map((url, i) => ({
                  url,
                  ordre: i,
                })),
              }
            : undefined,
        },
        include: {
          geolocalisation: true,
        },
      });

      /* ----- Mise à jour PostGIS pour le champ geoPoint ----- */
      await prisma.$queryRaw`
        UPDATE "Geolocalisation"
        SET "geoPoint" = ST_SetSRID(
          ST_MakePoint(${propriete.geolocalisation.lng}, ${propriete.geolocalisation.lat}),
          4326
        )
        WHERE id = ${proprieteCreated.geolocalisation!.id}
      `;

      /* ----- Création de l'hôtel ----- */
      const hotelCreated = await prisma.hotel.create({
        data: {
          proprieteId: proprieteCreated.id,
          nombreEtoiles: nombreEtoiles ?? 1,
          nombreChambresTotal: nombreChambresTotal ?? totalChambres,
          nombreVoyageursMax: nombreVoyageursMax ?? maxVoyageurs,
          politiqueAnnulation: politiqueAnnulation ?? null,
        },
      });


      /* ----- Création des chambres liées à l’hôtel ----- */
      if (chambres.length > 0) {
        await prisma.chambre.createMany({
          data: chambres.map((ch) => ({
            nom: ch.nom,
            description: ch.description ?? "",
            prixParNuit: ch.prixParNuit,
            capacite: ch.capacite,
            disponible: ch.disponible ?? true,
            proprieteId: hotelCreated.proprieteId,
          })),
        });
      }

      /* ----- Disponibilité par défaut ----- */
      await prisma.disponibilite.create({
        data: {
          hotelId: hotelCreated.id,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          disponible: true,
        },
      });

      /* ----- Récupération complète ----- */
      const finalHotel = await prisma.hotel.findUnique({
        where: { id: hotelCreated.id },
        include: {
          propriete: { include: { images: true, geolocalisation: true } },
          chambres: true,
          disponibilites: true,
        },
      });

      return res.status(201).json({ data: serializeBigInt(finalHotel) });
    }

    /* Méthode non supportée */
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erreur serveur",
    });
  }
}
