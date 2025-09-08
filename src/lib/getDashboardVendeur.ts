import { prisma } from "@/lib/prisma"
import { OffreStatut, Type } from "@prisma/client"

 
export async function getMesProprietes(userId: string){

	const parsedUserId = parseInt(userId)

	return await prisma.propriete.findMany({
		where: { proprietaireId: parsedUserId },
		orderBy: { createdAt:'desc' },
		take: 3
	})
}

export async function getMesOffresRecus(userId: string)
{
	const parsedUserId = parseInt(userId)

	const [offresRecentes, totalOffresEnAttente] = await Promise.all([
		prisma.offre.findMany({
			where: {
				propriete: {
					proprietaireId: parsedUserId,
				},
			},
			include: {
				user: true,
				propriete: true,
			},
			orderBy: { createdAt: 'desc'},
			take: 3,
		}),

		prisma.offre.count({
			where: {
				propriete: {
					proprietaireId: parsedUserId,
				},
				statut: OffreStatut.EN_ATTENTE,
			},
		})
	])

	return { offresRecentes, totalOffresEnAttente}
}

// Récupérer les prochaines visites de mes biens
export async function getMesProchainesVisites(userId: string){
	const parsedUserId = parseInt(userId)

	const prochainesVisites = await prisma.reservation.findMany({
    where: {
      type: Type.VISITE,
      dateArrivee: { gte: new Date() },
      propriete: {
        proprietaireId: parsedUserId, // on filtre par propriétaire de la propriété
      },
    },
    include: {
      propriete: true, // on inclut les infos de la propriété si besoin
      user: true,      // on inclut les infos de l'utilisateur qui a réservé
    },
    orderBy: {
      dateArrivee: 'asc', // les visites les plus proches en premier
    },
    take: 10, // exemple : limiter à 10 prochaines visites
  })

  return prochainesVisites
}