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
	})
}

// Récupérer les prochaines visites d'un utilisateur
export async function getMesProchainesVisites(userId: string){
	const parsedUserId = parseInt(userId)
	return await prisma.propriete.findMany({
    where: {
      reservations: {
        some: {
          userId: parsedUserId,
          type: Type.VISITE,
          date: { gte: new Date() }, // uniquement les visites à venir
        },
      },
    },
    include: {
      reservations: {
        where: {
          userId: parsedUserId,
          type: Type.VISITE,
          date: { gte: new Date() },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}