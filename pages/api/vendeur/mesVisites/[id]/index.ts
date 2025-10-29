import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'
import { VisiteStatut } from '@prisma/client'

function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID de visite invalide' })
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

    // ✅ Trouver la visite et vérifier que la propriété appartient à ce vendeur
    const visite = await prisma.visite.findUnique({
      where: { id: Number(id) },
      include: {
        propriete: true,
      },
    })

    if (!visite) {
      return res.status(404).json({ message: 'Visite introuvable' })
    }

    if (visite.propriete?.proprietaireId !== Number(userId)) {
      return res.status(403).json({
        message: "Accès refusé : cette visite ne vous appartient pas",
      })
    }

    // ✅ PATCH : le vendeur met à jour le statut
    if (req.method === 'PATCH') {
      const { statut } = req.body

      // Vérifier que le statut est valide (dans l'enum VisiteStatut)
      if (!statut || !Object.values(VisiteStatut).includes(statut)) {
        return res.status(400).json({
          message: `Statut invalide. Valeurs possibles : ${Object.values(VisiteStatut).join(', ')}`,
        })
      }

      const visiteMiseAJour = await prisma.visite.update({
        where: { id: Number(id) },
        data: { statut },
        include: {
          propriete: {
            select: { id: true, nom: true },
          },
          user: {
            select: { id: true, prenom: true, nom: true },
          },
        },
      })

      const safeVisite = serializeBigInt(visiteMiseAJour)

      return res.status(200).json({
        message: `Visite ${statut.toLowerCase()} avec succès.`,
        data: safeVisite,
      })
    }

    // ❌ Méthode non autorisée
    return res.status(405).json({ message: 'Méthode non autorisée' })
  } catch (error) {
    console.error('Erreur /api/vendeur/mesVisites/[id] :', error)
    return res.status(500).json({
      message: 'Erreur serveur',
      error
    })
  }
}
