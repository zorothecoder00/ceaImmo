import { prisma } from "@/lib/prisma"
import { OffreStatut, Statut } from "@prisma/client"

 
export async function getMesProprietes(userId: string) {
  const parsedUserId = parseInt(userId)

  const myProperties = await prisma.propriete.findMany({
    where: { proprietaireId: parsedUserId },
    include: {
      offres: true, // pour compter les offres liées
      images: { orderBy: { ordre: 'asc' } },
    },
    orderBy: { createdAt: "desc" },
  })

  // 🧮 Calcul des statistiques
  const activeProperties = myProperties.filter(
    (p) => p.statut === Statut.DISPONIBLE || p.statut === Statut.EN_NEGOCIATION
  ).length

  const reservedProperties = myProperties.filter(
    (p) => p.statut === Statut.RESERVE
  ).length

  const soldProperties = myProperties.filter(
    (p) => p.statut === Statut.VENDU   
  ).length

  const totalViews = myProperties.reduce((sum, p) => sum + (p.nombreVu || 0), 0)

  // Nombre d’offres en attente sur mes propriétés
  const pendingOffers = myProperties.reduce((sum, p) => {
    const pending = p.offres.filter(
      (o) => o.statut === OffreStatut.EN_ATTENTE
    ).length
    return sum + pending
  }, 0)

  // Retourne aussi les 3 plus récentes propriétés
  const recentProperties = myProperties.slice(0, 3)

  return {
    recentProperties,
    stats: {
      activeProperties,
      reservedProperties,
      soldProperties,
      totalViews,
      pendingOffers,
    },
  }
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