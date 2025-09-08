// /lib/getDashboardAgent.ts
import { prisma } from "@/lib/prisma"
import { Statut, Categorie } from "@prisma/client"

/**
 * Récupérer les 3 dernières propriétés selon statut et catégorie
 */
export async function getProprietes(
  statut?: Statut,
  categorie?: Categorie
) {
  return prisma.propriete.findMany({  
    where: {
      ...(statut ? { statut } : {}),
      ...(categorie ? { categorie } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })
}

/**
 * Récupérer les 3 derniers rendez-vous dont l’agent est responsable
 */
export async function getReservationsByAgent(agentId: number) {
  return prisma.reservation.findMany({
    where: {
      agentId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      propriete: {
        select: { id: true, nom: true, categorie: true, statut: true },
      },
      user: {
        select: { id: true, nom: true, prenom: true },
      },
    },
  })
}
