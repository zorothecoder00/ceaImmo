// pages/api/vendeur/mesHotels.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma';
import { Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";

interface ProprieteInput {
  nom: string;
  description?: string;
  categorie: Categorie;
  statut?: Statut;
  geolocalisation: string;
  nombreChambres: number;
  visiteVirtuelle?: string;
  prix?: string; // on convertira en BigInt
  surface?: string; // idem
  imageUrls?: string[];
}

interface ChambreInput {
  nom: string;
  description?: string;
  prixParNuit: number;
  capacite: number;
  disponible?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse    
) {
  try {   
    const session = await getAuthSession( req, res );
    if (!session || !session.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const proprietaireId = Number(session.user.id);

    function serializeBigInt<T>(obj: T): T {  
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }

    // GET: Récupérer tous les hôtels du vendeur connecté
    if (req.method === "GET") {
      const hotels = await prisma.hotel.findMany({
        where: {
          propriete: {
            proprietaireId,
          },
        },
        include: {
          propriete: true,
          chambres: true,
          disponibilites: true,
        },
      });

      const safeHotels = serializeBigInt(hotels);

      return res.status(200).json({ data: safeHotels });
    }

    // POST: Créer un nouvel hôtel
    if (req.method === "POST") {
      const {
        propriete,
        nombreEtoiles,
        nombreChambresTotal,
        nombreVoyageursMax,
        politiqueAnnulation,
        chambres,
      }: {
        propriete: ProprieteInput;
        nombreEtoiles?: number;
        nombreChambresTotal?: number;
        nombreVoyageursMax?: number;
        politiqueAnnulation?: string;
        chambres?: ChambreInput[];
      } = req.body;

      // Validations
      if (!propriete || propriete.categorie !== Categorie.HOTEL) {
        return res.status(400).json({ message: "Propriété de type HOTEL requise" });
      }

      const createProprieteData = {
        nom: propriete.nom,
        description: propriete.description ?? null,
        categorie: Categorie.HOTEL,
        statut: propriete.statut ?? Statut.DISPONIBLE,
        geolocalisation: propriete.geolocalisation,
        nombreChambres: Number(propriete.nombreChambres),
        visiteVirtuelle: propriete.visiteVirtuelle ?? null,
        proprietaireId,
        prix: propriete.prix ? BigInt(propriete.prix) : undefined,
        surface: propriete.surface ? BigInt(propriete.surface) : undefined,
        images: propriete.imageUrls?.length
          ? { create: propriete.imageUrls.map((url, index) => ({ url, ordre: index })) }
          : undefined,
      };

       // Création hôtel
      const nouvelHotel = await prisma.hotel.create({
        data: {
          propriete: { create: createProprieteData },
          nombreEtoiles: nombreEtoiles ?? 1,
          nombreChambresTotal: nombreChambresTotal ?? Number(propriete.nombreChambres),
          nombreVoyageursMax: nombreVoyageursMax ?? 1,
          politiqueAnnulation: politiqueAnnulation ?? null,
        },
        include: {
          propriete: { include: { images: true } },
          chambres: true,
          disponibilites: true,
        },
      });

      // Création chambres si fournies
      if (chambres && chambres.length > 0) {
        await prisma.chambre.createMany({
          data: chambres.map((ch) => ({
            nom: ch.nom,
            description: ch.description ?? "",
            prixParNuit: ch.prixParNuit,
            capacite: ch.capacite,
            disponible: ch.disponible ?? true,
            proprieteId: nouvelHotel.proprieteId,
            hotelId: nouvelHotel.id,
          })),
        });
      }
        
      await prisma.disponibilite.create({
        data: {
          hotelId: nouvelHotel.id,
          startDate: new Date(), // aujourd'hui
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // +1 an
          disponible: true,
        }
      });


      const safeNouvelHotel = serializeBigInt(await prisma.hotel.findUnique({
        where: { id: nouvelHotel.id },
        include: {
          propriete: { include: { images: true } },
          chambres: true,
          disponibilites: true,
        },
      }));

      return res.status(201).json({ data: safeNouvelHotel });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    console.error(error);
    res.status(500).json({ message });
  }
}
