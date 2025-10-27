import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Vérification de la méthode
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Méthode non autorisée' })
    }

    // ✅ Vérification de la session utilisateur
    const session = await getAuthSession(req, res)

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Non authentifié' })
    }

    const userId = session.user.id

    // ✅ Vérifier que c’est bien un VENDEUR
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { role: true },
    })

    if (!user || user.role !== 'VENDEUR') {
      return res.status(403).json({
        message: 'Accès refusé : réservé aux vendeurs',
      })
    }

    // ✅ Récupération des visites liées aux propriétés de ce vendeur
    const visites = await prisma.visite.findMany({
      where: {
        propriete: {
          proprietaireId: Number(userId),
        },
      },
      include: {
        propriete: {
          select: {
            id: true,
            nom: true,
            prix: true,
            surface: true,
            geolocalisation: true,
            nombreChambres: true,
          },
        },
        user: {
          select: {
            id: true,
            prenom: true,
            nom: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    })

    // ✅ Retour des données
    return res.status(200).json({ data: visites })
  } catch (error) {
    console.error('Erreur /api/vendeur/mesVisites :', error)
    return res.status(500).json({
      message: 'Erreur serveur',
      error
    })
  }
}
