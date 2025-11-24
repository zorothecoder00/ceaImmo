import { prisma } from '@/lib/prisma'
import { Statut, Categorie, StatutTransaction, Prisma } from '@prisma/client'
 
export async function getAvailableProprietes(userId?: string) {
  const proprietes = await prisma.propriete.findMany({
    where: { statut: Statut.DISPONIBLE },
    include: {
      images: {  
        orderBy: { ordre: 'asc' },
        take: 1  
      },
      favoris: userId ? {  
        where: { userId: parseInt(userId) }
      } : false       
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  return proprietes.map(prop => ({
    ...prop,  
    isFavorite: userId ? prop.favoris.length > 0 : false
  }))
}

// Filtrer par catégorie + statut + budget
export async function filtrageProprietes(
  userId?: string,
  nom?: string,
  geolocalisation?: string,
  categorie?: Categorie,
  statut?: Statut,   
  minPrix?: number | bigint,
  maxPrix?: number | bigint,
  minSurface?: number,
  maxSurface?: number,
  nombreChambres?: number
) {

  const prixFilter: Prisma.IntFilter = {};
  if (minPrix !== undefined && minPrix !== null) prixFilter.gte = Number(minPrix);
  if (maxPrix !== undefined && maxPrix !== null) prixFilter.lte = Number(maxPrix);

  const surfaceFilter: Prisma.IntFilter = {};
  if (minSurface !== undefined && minSurface !== null) surfaceFilter.gte = minSurface;
  if (maxSurface !== undefined && maxSurface !== null) surfaceFilter.lte = maxSurface;

  const proprietes = await prisma.propriete.findMany({
    where: {
      ...(nom ? { nom: { contains: nom, mode: 'insensitive' } } : {}),
      ...(geolocalisation ? { geolocalisation: { contains: geolocalisation, mode: 'insensitive' } } : {}),
      ...(categorie && Object.values(Categorie).includes(categorie) ? { categorie } : {}),
      ...(statut && Object.values(Statut).includes(statut) ? { statut } : {}),
      ...(Object.keys(prixFilter).length ? { prix: prixFilter } : {}),
      ...(Object.keys(surfaceFilter).length ? { surface: surfaceFilter } : {}),
      ...(nombreChambres !== undefined ? { nombreChambres: { gte: nombreChambres } } : {}),
    },
    include: {
      images: { orderBy: { ordre: 'asc' }, take: 1 },
      favoris: userId ? { where: { userId: parseInt(userId) } } : false
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return proprietes.map(prop => ({
    ...prop,
    isFavorite: userId ? prop.favoris.length > 0 : false
  }));
}

// Récupérer les prochaines visites d'un utilisateur
export async function getMesProchainesVisites(userId: string){
	const parsedUserId = parseInt(userId)

	const [visites, total] = await Promise.all([
    // 1️⃣ Récupérer les prochaines visites de l'utilisateur
    prisma.visite.findMany({
      where: {
        userId: parsedUserId,
        date: { gte: new Date() }, // visites à venir
      },
      include: {
        propriete: {
          include: {
            images: {
              orderBy: { ordre: 'asc' },
              take: 1
            }
          }
        },
        agent: { 
         select:  { 
          nom: true ,
          prenom: true,
         },
        },
      },
      orderBy: {
        date: "asc", // les visites les plus proches en premier
      },
      take: 2, // limiter à 2 visites par exemple
    }),

    // 2️⃣ Compter le nombre total de prochaines visites
    prisma.visite.count({
      where: {
        userId: parsedUserId,
        date: { gte: new Date() },
      },
    }),
  ])
  
  return { visites, total }
}

// Récupérer les favoris d'un utilisateur
export async function getMesFavoris(userId: string) {
  const parsedUserId = parseInt(userId)

  const [favoris, total] = await Promise.all([
    prisma.favori.findMany({
      where: {
        userId: parsedUserId,
      },
      include: {
        propriete: {
          include: {
            images: {
              orderBy: { ordre: 'asc' },
              take: 1
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),

    prisma.favori.count({
      where: {
        userId: parsedUserId,
      },
    }),
  ])

  return { favoris, total }
}

// ✅ Toggle favori (ajouter ou retirer)
export async function toggleFavori(userId: string, proprieteId: number) {
  const parsedUserId = parseInt(userId) 
  
  try {
    const existingFavori = await prisma.favori.findUnique({
      where: {
        userId_proprieteId: {
          userId: parsedUserId,
          proprieteId: proprieteId
        }
      }
    })

    if (existingFavori) {
      // Retirer le favori
      await prisma.favori.delete({
        where: {
          userId_proprieteId: {
            userId: parsedUserId,
            proprieteId: proprieteId
          }
        }
      })
      return { success: true, action: 'removed', isFavorite: false }
    } else {
      // Ajouter le favori
      const favori = await prisma.favori.create({
        data: {
          userId: parsedUserId,
          proprieteId: proprieteId
        }
      })
      return { success: true, action: 'added', isFavorite: true, favori }
    }
  } catch (error) {
    console.error('Erreur toggle favori:', error)
    return { success: false, error: 'Erreur lors de la modification du favori' }
  }
}

// 💾 Sauvegarder une recherche
export async function sauvegarderRecherche(
  userId: string,
  data: {
    titre?: string
    categorie?: Categorie
    minPrix?: number
    maxPrix?: number
    geolocalisation?: string
    nombreChambres?: number
  }
) {
  return prisma.recherche.create({
    data: {
      userId: Number(userId),
      titre: data.titre ?? 'Nouvelle recherche',
      categorie: data.categorie,
      minPrix: data.minPrix,
      maxPrix: data.maxPrix,
      geolocalisation: data.geolocalisation,
      nombreChambres: data.nombreChambres
    }
  })
}

// 🔥 Nouvelle fonction : Recherches + Résultats associés
export async function getRecherchesSauvegardeesEtResultats(userId: string) {
  const recherches = await prisma.recherche.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' }
  })

  // Pour chaque recherche, on applique filtrageProprietes()
  const recherchesAvecResultats = await Promise.all(
    recherches.map(async (r) => {
      const resultats = await filtrageProprietes(
        userId,
        r.titre ?? undefined,
        r.geolocalisation ?? undefined,
        r.categorie ?? undefined,
        undefined, 
        r.minPrix !== null && r.minPrix !== undefined ? Number(r.minPrix) : undefined,
        r.maxPrix !== null && r.maxPrix !== undefined ? Number(r.maxPrix) : undefined,
        undefined,
        undefined,
        r.nombreChambres ?? undefined
      );

      return {
        ...r,
        resultats
      }
    })
  )

  return {
    recherches: recherchesAvecResultats,
    total: recherchesAvecResultats.length
  }
}

export async function getRecherchesSauvegardees(userId: string) {
  const recherches = await prisma.recherche.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
    take: 2
  });

  return { recherches, total: recherches.length };
}

export async function getMesTransactionsEnAttenteAcheteur(userId: string) {
  const parsedUserId = parseInt(userId);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: parsedUserId,
      statut: StatutTransaction.EN_ATTENTE, // seules les transactions à finaliser
    },
    include: {
      offre: {
        select: {
          montant: true,
          userId: true, // éventuellement l'acheteur
          propriete: {
            select: {
              id: true,
              nom: true,
              statut: true,
              images: { orderBy: { ordre: 'asc' }, take: 1 },
            },
          },
        },
      },
      agent: {
        select: { id: true, nom: true, prenom: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5, // limite pour le dashboard
  });

  return {
    transactions,
    total: transactions.length,
  };
}

