// lib/getDashboardAdmin.ts
import { prisma } from '@/lib/prisma'
import { Statut } from '@prisma/client'
  
/**
 * Récupère les stats du dashboard admin
 */
export const getDashboardStats = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } });
    const pendingUsers = await prisma.user.count({ where: { role: null } });

    const pendingProperties = await prisma.propriete.count({ where: { statut: Statut.EN_NEGOCIATION } });
    const reportedProperties = await prisma.propriete.count({ where: { signalements: { some: {} } } });
    const totalProperties = await prisma.propriete.count();
    const availableProperties = await prisma.propriete.count({ where: { statut: Statut.DISPONIBLE } });
    const soldProperties = await prisma.propriete.count({ where: { statut: Statut.VENDU } });
    const reservedProperties = await prisma.propriete.count({ where: { statut: Statut.RESERVE } });
  

    // Exemple de stats système (tu peux adapter)
    const systemStats = {
      uptime: '95.2%',      // ou calcul réel
      dailyViews: '2.4k',   // ou calcul réel
      growth: '+15%'        // ou calcul réel
    };

    return {
      users: { total: totalUsers, new: newUsers, pending: pendingUsers },
      properties: { 
        total: totalProperties, 
        available: availableProperties, 
        sold: soldProperties, 
        reserved: reservedProperties,
        pending: pendingProperties,
        reported: reportedProperties
      },        
      system: systemStats
    };


  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    throw new Error("Impossible de récupérer les stats du dashboard");
  }
};

/**
 * Récupère l'état actuel du dashboard admin.
 */
export const getDashboardAdmin = async () => {
  try {
    // Récupère la config (id = 1 par défaut)   
    const config = await prisma.config.findUnique({
      where: { id: 1 },
    });

    return {
      maintenance: config?.maintenance || false,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du dashboard admin:", error);
    throw new Error("Impossible de récupérer le dashboard admin");
  }
};

/**
 * Active ou désactive le mode maintenance.
 * @param enable boolean - true pour activer, false pour désactiver
 */
export const setMaintenanceMode = async (enable: boolean) => {
  try {
    // Met à jour la config
    const updatedConfig = await prisma.config.upsert({
      where: { id: 1 },
      update: { maintenance: enable },
      create: { id: 1, maintenance: enable },
    });

    return {
      maintenance: updatedConfig.maintenance,
      message: enable
        ? "Mode maintenance activé. Les utilisateurs ne peuvent plus accéder au site."
        : "Mode maintenance désactivé. Le site est à nouveau accessible.",
    };
  } catch (error) {
    console.error("Erreur lors de la modification du mode maintenance:", error);
    throw new Error("Impossible de modifier le mode maintenance");
  }
};
