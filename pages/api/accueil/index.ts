import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { Prisma, Categorie } from "@prisma/client"    

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {


      function serializeBigInt<T>(obj: T): T {  
        return JSON.parse(
          JSON.stringify(obj, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      }

      // `search` doit être un JSON string, ex:
      // ?search={"nom":"villa","geolocalisation":"Lomé","categorie":"VILLA","prixMin":100,"prixMax":500}

      const searchStr = req.query.search as string || '{}'
      const search = JSON.parse(searchStr)

      const { nom, geolocalisation, categorie, prixMin, prixMax } = search;

      const orFilters: Prisma.ProprieteWhereInput[] = []
      if(nom){
      	orFilters.push({ 
      		nom: { contains: String(nom), mode: 'insensitive' } 
      	})
      }

      if(geolocalisation){
      	orFilters.push({
      	 geolocalisation: { contains: String(geolocalisation), mode: 'insensitive' }
      	})
      }

      if(categorie){
      	const matchingCategorie = Object.values(Categorie).filter((c) =>
		    c.toLowerCase().includes(String(categorie).toLowerCase())
		  ) as Categorie[];

		  if (matchingCategorie.length > 0) {
		    orFilters.push({ categorie: { in: matchingCategorie } });
		  }
      }
      	
      if(prixMin){
      	orFilters.push({
      	 prix: { gte: Number(prixMin) } 
      	})
      }

      if(prixMax){
      	orFilters.push({
      	 prix: { lte: Number(prixMax) } 
      	})
      }

      const proprietes = await prisma.propriete.findMany({
        where: orFilters.length ? { OR: orFilters } : {},
        orderBy: {
          createdAt: "desc", // les dernières propriétés
        },
        take: 4, // par défaut 4 dernières
        select: {
          id: true,
          nom: true,
          categorie: true,
          prix: true,
          visiteVirtuelle: true, // ✅ récupérer le lien de visite virtuelle
          images: {               // ✅ récupérer les images Cloudinary
            select: { id: true, url: true, ordre: true },
            orderBy: { ordre: "asc" },
          },
          geolocalisation: true,
        },   
      });

      const safeProprietes = serializeBigInt(proprietes)

      return res.status(200).json({ data: safeProprietes });
    } catch (error) {
      console.error("Erreur serveur", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}