// pages/api/vendeur/mesHotels.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma';
import { Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";

type ChambreInput = {
  nom: string;
  description?: string;
  prixParNuit: number | string;
  capacite: number | string;
  disponible?: boolean;
};

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
      } = req.body;

      if (!propriete || propriete.categorie !== "HOTEL") {
        return res
          .status(400)
          .json({ message: "Propriété de type HOTEL requise" });
      }

      // Créer la propriété d'abord
      const nouvellePropriete = await prisma.propriete.create({
        data: {   
          nom: propriete.nom,
          description: propriete.description || null,
          prix: propriete.prix && propriete.prix !== "" ? BigInt(propriete.prix) : undefined,
          surface: propriete.surface && propriete.surface !== "" ? BigInt(propriete.surface) : undefined,
          categorie: Categorie.HOTEL,
          statut: propriete.statut || Statut.DISPONIBLE,
          geolocalisation: propriete.geolocalisation,
          nombreChambres: Number(propriete.nombreChambres),
          visiteVirtuelle: propriete.visiteVirtuelle || null,
          images: propriete.imageUrls && propriete.imageUrls.length > 0
            ? {
                create: propriete.imageUrls.map((url: string, index: number) => ({
                  url,
                  ordre: index
                }))
              }
            : undefined,
          proprietaireId, // ✅ depuis la session
        },
      });

      // Créer l'hôtel associé
      const nouvelHotel = await prisma.hotel.create({
        data: {   
          proprieteId: nouvellePropriete.id,  
          nombreEtoiles: nombreEtoiles || 1,
          nombreChambresTotal: nombreChambresTotal || Number(propriete.nombreChambres),
          nombreVoyageursMax: nombreVoyageursMax || 1,
          politiqueAnnulation: politiqueAnnulation || null,
          chambres: chambres && chambres.length > 0
            ? {
                create: chambres.map((ch: ChambreInput) => ({
                  nom: ch.nom,
                  description: ch.description || "",
                  prixParNuit: Number(ch.prixParNuit),
                  capacite: Number(ch.capacite),
                  disponible: ch.disponible ?? true,
                })),
              }
            : undefined,
        },
        include: {
          propriete: {
            include: { images: true } // ⚡ inclure les images ici
          },
          chambres: true,
          disponibilites: true,   
        },  
      });
  
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
        include: { propriete: true, chambres: true, disponibilites: true }
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
