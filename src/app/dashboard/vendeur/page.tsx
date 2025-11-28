// src/app/dashboard/vendeur/page.tsx

import { getAuthSession } from "@/lib/auth";   
import {  
  Building,             
  Calendar, 
  User,        
  Eye,       
  Edit,       
  MapPin,   
  Bed,
  Bath,
  Square,     
  TrendingUp,     
  Euro,
  Camera,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  Upload,   
  Trash2,
  AlertCircle  
} from 'lucide-react'  
import { Button } from '@/components/ui/button' 
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Categorie, VisiteStatut, Statut, OffreStatut } from '@prisma/client'
import { getMesProprietes, getMesOffresRecus, getMesProchainesVisites } from '@/lib/getDashboardVendeur'
import VendeurDashboardClient from '@/components/DashboardVendeur'

// Types     
interface Property {
  id: number  
  nom: string
  geolocalisation: string  
  prix: number|bigint
  nombreChambres: number  
  chambre?: string
  surface: number | bigint
  categorie: Categorie
  images: PropertyImage[]
  description?: string
  agent?: string
  avis?: Avis[]
  isFavorite?: boolean
  nombreVu: number
  createdAt: Date           // ✅ ajouté
  statut: Statut            // ✅ ajouté
}

interface Avis {
  id: number
  utilisateur: {
    id: number
    nom: string
    prenom: string
  }
  note: number
  commentaire: string
  createdAt: Date
}

interface Offer {
  id: string
  montant: number | bigint
  statut: OffreStatut
  createdAt: Date
  message?: string
  propriete: Property      // ✅ lien complet
  user: {  
    id: number
    prenom: string
    nom: string
  }
}

interface Visit {
  id: number
  propriete: Property | null
  date: string | Date
  agent?: {
    prenom: string
    nom: string
    email?: string | null
  } | null
  user?: {
    prenom: string
    nom: string
    email?: string | null
  } | null
  userId: number
  statut: VisiteStatut
}


interface PropertyImage {
  id: number
  url: string
  ordre: number
}

interface Chambre {
  nom: string
  description: string
  prixParNuit: string
  capacite: string
  disponible: boolean  
}

interface FormData {
  nom: string
  description?: string
  categorie: Categorie
  prix: string
  surface: string
  statut: Statut
  geolocalisation: string
  nombreChambres: string
  visiteVirtuelle: string
}

interface HotelFormData {
  propriete: FormData
  nombreEtoiles: string;
  nombreChambresTotal: string;
  nombreVoyageursMax: string;
  politiqueAnnulation: string;
  visiteVirtuelle: string;
}

// Main Dashboard Component
export default async function VendeurDashboard() { 
  const session = await getAuthSession()
  if (!session || !session?.user) {
    return (
      <div className="p-10 text-center text-gray-600">
        Vous devez être connecté pour accéder à ce tableau de bord.
      </div>
    )
  }

  const userId = session?.user?.id.toString()
 
  // 🔹 Appels serveurs
  const [proprietesData, offresData, visitesData] = await Promise.all([
    getMesProprietes(userId),
    getMesOffresRecus(userId),
    getMesProchainesVisites(userId),
  ])

  const { recentProperties, stats } = proprietesData
  const { offresRecentes, totalOffresEnAttente } = offresData
  const prochainesVisites = visitesData

  const recentPropertiesConverted = recentProperties.map(p => ({
    ...p,
    prix: Number(p.prix),
    surface: Number(p.surface),
    createdAt: p.createdAt.toISOString(),
  }))

  const offresRecentesConverted = offresRecentes.map(o => ({
    ...o,
    montant: Number(o.montant),
    propriete: {
      ...o.propriete,
      prix: Number(o.propriete.prix),
      surface: Number(o.propriete.surface),
      createdAt: o.propriete.createdAt.toISOString()
    },
    createdAt: o.createdAt.toISOString()
  }))

  const prochainesVisitesConverted = prochainesVisites.map(v => ({
    ...v,
    propriete: v.propriete
      ? {
          ...v.propriete,
          prix: Number(v.propriete.prix),
          surface: Number(v.propriete.surface),
          createdAt: v.propriete.createdAt.toISOString()
        }
      : null,
    date: v.date instanceof Date ? v.date.toISOString() : v.date
  }))

  return (
    <VendeurDashboardClient
      user={{
        id: session.user.id.toString(),
        prenom: session.user.prenom || 'Utilisateur',
        nom: session.user.nom || ''
      }}
      stats={stats}
      recentProperties={recentPropertiesConverted}
      offresRecentes={offresRecentesConverted}
      prochainesVisites={prochainesVisitesConverted}
    />
  )
}
  