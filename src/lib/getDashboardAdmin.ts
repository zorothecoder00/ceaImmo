// /lib/getDashboardAdmin.ts
import { prisma } from "@/lib/prisma"; // adapte selon ton chemin vers prisma client
import { subDays } from "date-fns";

export async function getDashboardAdmin() {
  // 📊 1. Gestion des utilisateurs
  const totalUsers = await prisma.user.count();
  const nouveauxUsers = await prisma.user.count({
    where: { createdAt: { gte: subDays(new Date(), 5) } }, // créés dans les 5 derniers jours
  });
  const usersEnAttente = await prisma.user.count({
    where: { role: null }, // exemple: pas encore attribué de rôle
  });

  // 🏠 2. Modération des propriétés
  const totalProprietes = await prisma.propriete.count();
  const aValider = await prisma.propriete.count({
    where: { statut: "RESERVE" }, // exemple: propriétés en statut réservé = à valider
  });
  const signalees = await prisma.propriete.count({
    where: { statut: "EN_NEGOCIATION" }, // exemple: tu peux remplacer par un champ signalement si tu ajoutes ça plus tard
  });

  // 📈 3. Analytics & Statistiques (mock pour l'instant)
  const uptime = 95.2; // tu peux brancher un vrai service de monitoring
  const vuesParJour = 2400; // exemple: logs ou analytics externes
  const croissance = 15; // en %

  // ⚙️ 4. Configuration système (mock aussi)
  const stockage = "2.1GB";
  const backup = "Auto";
  const securite = true;

  return {
    utilisateurs: {
      total: totalUsers,
      nouveaux: nouveauxUsers,
      enAttente: usersEnAttente,
    },
    proprietes: {
      total: totalProprietes,
      aValider,
      signalees,
    },
    analytics: {
      uptime,
      vuesParJour,
      croissance,
    },
    systeme: {
      stockage,
      backup,
      securite,
    },
  };
}
