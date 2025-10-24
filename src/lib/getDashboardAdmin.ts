// /lib/getDashboardAdmin.ts
import { prisma } from "@/lib/prisma"
import { subDays } from "date-fns"

export async function getDashboardAdmin() {
  // 📊 1. Gestion des utilisateurs
  const totalUsers = await prisma.user.count()
  const nouveauxUsers = await prisma.user.count({
    where: { createdAt: { gte: subDays(new Date(), 5) } },
  })
  const usersEnAttente = await prisma.user.count({
    where: { role: null },
  })

  // 🏠 2. Modération des propriétés
  const totalProprietes = await prisma.propriete.count()
  const aValider = await prisma.propriete.count({
    where: { statut: "RESERVE" },
  })
  const signalees = await prisma.propriete.count({
    where: { statut: "EN_NEGOCIATION" },
  })

  // 📈 3. Analytics & Statistiques (mock pour l'instant)
  const uptime = 95.2
  const vuesParJour = 2400
  const croissance = 15

  // ⚙️ 4. Configuration système (BDD)
  const config = await prisma.config.findUnique({ where: { id: 1 } })

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
      maintenance: config?.maintenance ?? false,
      stockage: "2.1GB",
      backup: "Auto",
      securite: true,
    },
  }
}

// 🚀 Fonction pour activer/désactiver la maintenance
export async function toggleMaintenance(newValue: boolean) {
  return await prisma.config.update({
    where: { id: 1 },
    data: { maintenance: newValue },
  })
}

