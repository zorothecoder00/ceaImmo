import type { NextApiRequest, NextApiResponse } from 'next'
import { toggleFavori } from '@/lib/getDashboardAcheteur'
// import { getServerSession } from 'next-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' })
    }

    // Exemple d’authentification (optionnelle)
    // const session = await getServerSession(req, res)
    // if (!session) {
    //   return res.status(401).json({ error: 'Non authentifié' })
    // }

    const { userId, proprieteId } = req.body

    if (!userId || !proprieteId) {
      return res.status(400).json({
        error: 'userId et proprieteId sont requis',
      })
    }

    const result = await toggleFavori(userId.toString(), parseInt(proprieteId))

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json({ error: result.error })
    }
  } catch (error) {
    console.error('Erreur API favoris:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
