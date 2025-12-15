// lib/vendeur.ts (mis à jour)

import { prisma } from "@/lib/prisma";
import { OffreStatut, Statut, StatutTransaction } from "@prisma/client";

export async function getMesProprietes(userId: string) {
  const parsedUserId = parseInt(userId);   
    
  const myProperties = await prisma.propriete.findMany({
    where: { proprietaireId: parsedUserId },
    include: {
      offres: true, // pour compter les offres liées
      images: { orderBy: { ordre: "asc" } },
      hotel: {
        include: {
          chambres: true, // récupère les chambres associées à l'hôtel
        }
      },
      chambres: true,
      avis: {
        select: { note: true },
      },
      geolocalisation: true, // ✅ ajouté
    },
    orderBy: { createdAt: "desc" },
  });

  // 🧮 Calcul des statistiques
  const activeProperties = myProperties.filter(
    (p) => p.statut === Statut.DISPONIBLE || p.statut === Statut.EN_NEGOCIATION
  ).length;

  const reservedProperties = myProperties.filter((p) => p.statut === Statut.RESERVE)
    .length;

  const soldProperties = myProperties.filter((p) => p.statut === Statut.VENDU)
    .length;

  const totalViews = myProperties.reduce((sum, p) => sum + (p.nombreVu || 0), 0);

  // Nombre d’offres en attente sur mes propriétés
  const pendingOffers = myProperties.reduce((sum, p) => {
    const pending = p.offres.filter((o) => o.statut === OffreStatut.EN_ATTENTE)
      .length;
    return sum + pending;
  }, 0);

  // Retourne aussi les 3 plus récentes propriétés
  const recentProperties = myProperties.slice(0, 3);

  return {
    recentProperties,
    stats: {
      activeProperties,
      reservedProperties,
      soldProperties,
      totalViews,
      pendingOffers,
    },
  };
}

export async function getMesOffresRecus(userId: string) {
  const parsedUserId = parseInt(userId);

  const [offresRecentes, totalOffresEnAttente] = await Promise.all([
    prisma.offre.findMany({
      where: {
        propriete: {
          proprietaireId: parsedUserId,
        },
      },
      include: {
        user: true,
        propriete: {
          include: {
            images: { orderBy: { ordre: "asc" }, take: 1 },
            geolocalisation: true, // ✅ ajouté
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    prisma.offre.count({
      where: {
        propriete: {
          proprietaireId: parsedUserId,
        },
        statut: OffreStatut.EN_ATTENTE,
      },
    }),
  ]);

  return { offresRecentes, totalOffresEnAttente };
}

// Récupérer les prochaines visites de mes biens
export async function getMesProchainesVisites(userId: string) {
  const parsedUserId = parseInt(userId);

  const prochainesVisites = await prisma.visite.findMany({
    where: {
      propriete: {
        proprietaireId: parsedUserId, // filtre sur les propriétés que je possède
      },
      date: { gte: new Date() }, // uniquement les visites à venir
    },
    include: {
      propriete: {
        include: {
          images: { orderBy: { ordre: "asc" }, take: 1 },
          geolocalisation: true, // ✅ ajouté
        },
      }, // infos de la propriété visitée
      user: true, // infos de l'utilisateur qui a demandé la visite
      agent: true, // si besoin, infos de l'agent assigné
    },
    orderBy: {
      date: "asc", // visites les plus proches en premier
    },
    take: 10, // limite à 10 visites par exemple
  });

  return prochainesVisites;
}

// Ajoutez dans votre getDashboardVendeur.ts
export async function getTransactionsAFinaliser(userId: string) {
  const parsedUserId = parseInt(userId);

  const transactions = await prisma.transaction.findMany({
    where: {
      agentId: parsedUserId,
      statut: StatutTransaction.REUSSIE, // paiements déjà réussis par l'acheteur
      // ❗ Optionnel : s'assurer que le transfert n'a pas encore été fait
      offre: {
        propriete: {
          statut: { in: [Statut.RESERVE] }, // ✅ utilise l'enum Statut au lieu d'une string
        },
      },
    },
    include: {
      user: {
        // infos acheteur
        select: { id: true, nom: true, prenom: true },
      },
      offre: {
        include: {
          propriete: {
            include: {
              images: { orderBy: { ordre: "asc" }, take: 1 },
              geolocalisation: true, // ✅ ajouté
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5, // limit pour le dashboard
  });

  return {
    transactions,
    total: transactions.length,
  };
}

// 🔔 Compter les notifications non vues d'un utilisateur
export async function getNotificationsNonVues(userId: string) {
  const parsedUserId = Number(userId)

  const notifications = await prisma.notification.findMany({
    where: {
      userId: parsedUserId,
      vu: false,
    },
    include: {
      emetteur: {
        select: { id: true, nom: true, prenom: true },
      },
    },
    orderBy: { dateNotification: 'desc' },
    take: 10,
  })

  return {
    notifications,
    total: notifications.length,
  }
}