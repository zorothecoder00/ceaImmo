import type { NextApiRequest, NextApiResponse } from 'next'  
import { toggleFavori } from '@/lib/getDashboardAcheteur'  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' })
  }

  try {
    const { userId, proprieteId } = req.body
   
    if (!userId || !proprieteId) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants'
      })
    }

    const result = await toggleFavori(userId, proprieteId)

    return res.status(200).json({
      success: result.success,
      isFavorite: result.isFavorite,
      action: result.action,
      error: result.error ?? null
    })

  } catch (error) {
    console.error('Erreur API toggleFavori:', error)

    return res.status(500).json({
      success: false,
      isFavorite: null,
      error: 'Erreur serveur interne'
    })
  }
}

      