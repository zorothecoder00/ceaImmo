import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = Number(session.user.id);

  // Vérifier que l'utilisateur est VENDEUR
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.VENDEUR) {
    return res.status(403).json({ message: "Accès refusé : réservé aux vendeurs" });
  }

  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Méthode non autorisée' })
    }

    // 3️⃣ Récupérer les propriétés de ce vendeur
    const proprietes = await prisma.propriete.findMany({
      where: { proprietaireId: userId },
      select: { id: true },
    })

    if (proprietes.length === 0) {
      return res.status(200).json({ data: [], message: 'Aucune propriété trouvée' })
    }

    const proprieteIds = proprietes.map((p) => p.id)

    // 4️⃣ Récupérer toutes les offres faites sur ces propriétés
    const offres = await prisma.offre.findMany({
      where: {
        proprieteId: { in: proprieteIds },
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
            statut: true,
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
      orderBy: { createdAt: 'desc' },
    })

    // 5️⃣ Mise en forme (facultative)
    const formatted = offres.map((o) => ({
      id: o.id,
      montant: Number(o.montant),
      message: o.message,
      statut: o.statut,
      createdAt: o.createdAt,
      propriete: {
        id: o.propriete.id,
        nom: o.propriete.nom,
        prix: Number(o.propriete.prix),
        surface: Number(o.propriete.surface),
        geolocalisation: o.propriete.geolocalisation,
        nombreChambres: o.propriete.nombreChambres,
      },
      acheteur: {
        id: o.user.id,
        prenom: o.user.prenom,
        nom: o.user.nom,
      },
    }))

    const safeFormatted = serializeBigInt(formatted)

    return res.status(200).json({ data: safeFormatted })
  } catch (error) {
    console.error('Erreur lors du chargement des offres vendeur:', error)
    return res.status(500).json({
      message: 'Erreur serveur',
      error
    })
  }
}
