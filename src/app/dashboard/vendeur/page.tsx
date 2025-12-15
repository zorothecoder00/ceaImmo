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
import { getMesProprietes, getMesOffresRecus, getMesProchainesVisites, getNotificationsNonVues } from '@/lib/getDashboardVendeur'
import VendeurDashboardClient from '@/components/DashboardVendeur'

// Types   
interface Geolocalisation {
  id: number  
  proprieteId: number
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
}

interface Property {
  id: number  
  nom: string
  geolocalisation: Geolocalisation | null  
  prix: number|bigint
  nombreChambres: number  
  chambres?: Chambre[]
  surface: number | bigint
  categorie: Categorie
  images: PropertyImage[]
  description?: string
  agent?: string
  avis?: Avis[]
  isFavorite?: boolean
  hotel?: HotelFormData
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
  id: number;
  nom?: string
  description?: string
  prixParNuit: number
  capacite?: string
  disponible?: boolean  
}

interface FormData {
  nom: string
  description?: string
  categorie: Categorie
  prix: string
  surface: string  
  statut: Statut
  geolocalisation: Geolocalisation
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
  chambres: Chambre[];
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
    getNotificationsNonVues(userId),
  ])
   
  const { recentProperties, stats } = proprietesData
  const { offresRecentes, totalOffresEnAttente } = offresData
  const prochainesVisites = visitesData
  const { total: totalNotifications } = notificationsData

  const recentPropertiesConverted = recentProperties.map(p => ({
    ...p,
    prix: Number(p.prix),
    surface: Number(p.surface),
    createdAt: p.createdAt.toISOString(),
    hotel: p.hotel
      ? {
          id: p.hotel.id,
          nombreEtoiles: p.hotel.nombreEtoiles ?? 0,
          nombreChambresTotal: p.hotel.nombreChambresTotal ?? 0,
          nombreVoyageursMax: p.hotel.nombreVoyageursMax ?? 0,
          prixParNuitParDefaut: Number(p.hotel.prixParNuitParDefaut ?? 0),
          chambres: p.hotel.chambres?.map(c => ({
            id: c.id ?? Date.now(),
            nom: c.nom,
            description: c.description ?? "", // <-- on transforme null en string vide
            prixParNuit: Number(c.prixParNuit ?? 0),
            capacite: String(c.capacite),     // si c.capacite est un number
            disponible: c.disponible
          })) ?? []
        }
      : null,
    chambres: p.chambres?.map(c => ({
      id: c.id ?? Date.now(),
      nom: c.nom ?? `Chambre ${c.id}`,
      description: c.description ?? "",
      prixParNuit: Number(c.prixParNuit ?? 0),
      capacite: String(c.capacite ?? 1),
      disponible: c.disponible ?? true,
    })) ?? [],
    nombreChambres: p.nombreChambres ?? undefined,
    geolocalisation: p.geolocalisation ?? null,

  }))

  const offresRecentesConverted = offresRecentes.map(o => ({
    ...o,
    montant: Number(o.montant),
    propriete: {
      ...o.propriete,
      prix: Number(o.propriete.prix),
      surface: Number(o.propriete.surface),
      createdAt: o.propriete.createdAt.toISOString(),
      nombreChambres: o.propriete.nombreChambres ?? undefined,
      geolocalisation: o.propriete.geolocalisation ?? null,
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
          createdAt: v.propriete.createdAt.toISOString(),
          nombreChambres: v.propriete.nombreChambres ?? undefined,
          geolocalisation: v.propriete.geolocalisation ?? null,
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
      totalNotifications={totalNotifications}
    />
  )        
}
  