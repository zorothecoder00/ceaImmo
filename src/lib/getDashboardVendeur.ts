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

	const prochainesVisites = await prisma.visite.findMany({
    where: {
      propriete: {
        proprietaireId: parsedUserId, // filtre sur les propriétés que je possède
      },
      date: { gte: new Date() }, // uniquement les visites à venir
    },
    include: {
      propriete: true, // infos de la propriété visitée
      user: true,      // infos de l'utilisateur qui a demandé la visite
      agent: true,     // si besoin, infos de l'agent assigné
    },
    orderBy: {
      date: "asc", // visites les plus proches en premier
    },
    take: 10, // limite à 10 visites par exemple
  });

  return prochainesVisites
}