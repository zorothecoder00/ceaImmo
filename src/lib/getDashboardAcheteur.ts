import { prisma } from '@/lib/prisma'
import { Statut, Categorie, Type } from '@prisma/client'
 
export async function getAvailableProprietes(){
	return await prisma.propriete.findMany({
		where: { statut: Statut.DISPONIBLE },
		orderBy: { createdAt:'desc' },
		take: 3
	})    
}

// Filtrer par catégorie + budget
export async function filtrageProprietes(
	geolocalisation?: string,
	categorie?: Categorie,   
	minPrix?: number,
	maxPrix?: number
){
	return await prisma.propriete.findMany({
		where: {
			statut: Statut.DISPONIBLE,
			...(geolocalisation ? { geolocalisation } : {}),
			...(categorie ? { categorie } : {}),
			...(minPrix !== undefined && maxPrix !== undefined ? { prix: { gte: minPrix, lte: maxPrix } } : {}),
		},
		orderBy: { createdAt: 'desc'},
		take: 3
	})
}

// Récupérer les prochaines visites d'un utilisateur
export async function getMesProchainesVisites(userId: string){
	const parsedUserId = parseInt(userId)

	const [visites, total] = await Promise.all([
    // 1️⃣ Récupérer les prochaines visites de l'utilisateur
    prisma.visite.findMany({
      where: {
        userId: parsedUserId,
        date: { gte: new Date() }, // visites à venir
      },
      include: {
        propriete: true, // infos de la propriété visitée
        agent: true,     // infos de l'agent si besoin
      },
      orderBy: {
        date: "asc", // les visites les plus proches en premier
      },
      take: 2, // limiter à 2 visites par exemple
    }),

    // 2️⃣ Compter le nombre total de prochaines visites
    prisma.visite.count({
      where: {
        userId: parsedUserId,
        date: { gte: new Date() },
      },
    }),
  ])

  return { visites, total }
}

// Récupérer les favoris d'un utilisateur
export async function getMesFavoris(userId: string) {
  const parsedUserId = parseInt(userId)

  const [favoris, total] = await Promise.all([
    prisma.favori.findMany({
      where: {
        userId: parsedUserId,
      },
      include: {
        propriete: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),

    prisma.favori.count({
      where: {
        userId: parsedUserId,
      },
    }),
  ])

  return { favoris, total }
}