// src/app/dashboard/vendeur/page.tsx

import { useState } from 'react' 
import { getAuthSession } from "@/lib/auth";   
import {  
  Home, 
  Building,      
  Calendar, 
  Settings, 
  Bell,
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
  Plus,
  Trash2,
  Loader2,
  AlertCircle  
} from 'lucide-react'  
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button' 
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Categorie, VisiteStatut, Statut, OffreStatut } from '@prisma/client'
import { getMesProprietes, getMesOffresRecus, getMesProchainesVisites } from '@/lib/getDashboardVendeur'
import DashboardVendeurClient from '@/components/DashboardVendeur'

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

// Components
function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'blue',
  trend
}: { 
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  color?: string
  trend?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-500">{subtitle}</p>
            {trend && (
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] ?? ""}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: Property }) {
  const getStatusColor = (statut: string) => {  
    switch (statut) {
      case Statut.DISPONIBLE: return 'bg-green-100 text-green-800'
      case Statut.RESERVE: return 'bg-orange-100 text-orange-800'
      case Statut.VENDU: return 'bg-blue-100 text-blue-800'
      case Statut.EN_LOCATION: return 'bg-purple-100 text-purple-800'
      case Statut.EN_NEGOCIATION: return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (statut: Statut) => {
    switch (statut) {
      case Statut.DISPONIBLE: return 'bg-green-100 text-green-800'
      case Statut.RESERVE: return 'bg-orange-100 text-orange-800'
      case Statut.VENDU: return 'bg-blue-100 text-blue-800'
      case Statut.EN_LOCATION: return 'bg-purple-100 text-purple-800'
      case Statut.EN_NEGOCIATION: return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (statut: Statut) => {
    switch (statut) {
      case Statut.DISPONIBLE: return 'Disponible'
      case Statut.RESERVE: return 'Réservé'
      case Statut.VENDU: return 'Vendu'
      case Statut.EN_LOCATION: return 'En Location'
      case Statut.EN_NEGOCIATION: return 'En Négociation'
      default: return statut
    }
  }

  const daysOnMarket = Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const mainImage = property.images[0]?.url || '/placeholder-property.jpg'

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative h-48">
        <Image
          src={mainImage} 
          alt={property.nom}
          fill
          className="object-cover"
        />
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(property.statut)}`}>
          {getStatusIcon(property.statut)}
          {getStatusLabel(property.statut)}
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {daysOnMarket}j
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.nom}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {property.geolocalisation}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.nombreChambres}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.surface.toString()}m²
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {property.nombreVu}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {Number(property.prix).toLocaleString('fr-FR')} FCFA
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          {property.categorie}
        </div>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  const getStatusColor = (statut: OffreStatut) => {
    switch (statut) {
      case OffreStatut.EN_ATTENTE: return 'bg-yellow-100 text-yellow-800'
      case OffreStatut.ACCEPTEE: return 'bg-green-100 text-green-800'
      case OffreStatut.REFUSEE: return 'bg-red-100 text-red-800'
      case OffreStatut.EXPIREE: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (statut: OffreStatut) => {
    switch (statut) {
      case OffreStatut.EN_ATTENTE: return 'En attente'
      case OffreStatut.ACCEPTEE: return 'Acceptée'
      case OffreStatut.REFUSEE: return 'Refusée'
      case OffreStatut.EXPIREE: return 'Expirée'
      default: return statut
    }
  }
  const discount = ((Number(offer.propriete.prix) - Number(offer.montant)) / Number(offer.propriete.prix) * 100).toFixed(1)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {offer.user.prenom} {offer.user.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{offer.propriete.nom}</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {Number(offer.montant).toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-sm text-gray-500">
              (-{discount}%)
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.statut)}`}>
          {getStatusLabel(offer.statut)}
        </span>
      </div>
      
      {offer.message && (
        <p className="text-sm text-gray-600 mb-3 italic">&quot;{offer.message}&quot;</p>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
        </span>
        <div className="flex items-center space-x-2">
          {offer.statut === 'EN_ATTENTE' && (
            <>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700">
                Accepter
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
                Refuser
              </button>
            </>
          )}
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


function VisitCard({ visit }: { visit: Visit }) {
  const getStatusColor = (statut: VisiteStatut) => {
    switch (statut) {
      case VisiteStatut.CONFIRMEE: return 'bg-green-100 text-green-800'
      case VisiteStatut.DEMANDEE: return 'bg-blue-100 text-blue-800'
      case VisiteStatut.ANNULEE: return 'bg-red-100 text-red-800'
      case VisiteStatut.REPORTEE: return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (statut: VisiteStatut) => {
    switch (statut) {
      case VisiteStatut.CONFIRMEE: return 'Confirmée'
      case VisiteStatut.DEMANDEE: return 'Demandée'
      case VisiteStatut.ANNULEE: return 'Annulée'
      case VisiteStatut.REPORTEE: return 'Reportée'
      default: return statut
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {visit.user?.prenom} {visit.user?.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{visit.propriete?.nom}</p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(visit.date).toLocaleDateString('fr-FR')} à {new Date(visit.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {visit.user?.email}
          </div>
          {visit.agent && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <User className="h-4 w-4 mr-2" />
              Agent: {visit.agent.prenom} {visit.agent.nom}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.statut)}`}>
            {getStatusLabel(visit.statut)}
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-green-600">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
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

  return (
    <DashboardVendeurClient
      user={{
        id: session.user.id.toString(),
        prenom: session.user.prenom || 'Utilisateur',
        nom: session.user.nom || ''
      }}
      stats={stats}
      recentProperties={recentProperties}
      offresRecentes={offresRecentes}
      prochainesVisites={prochainesVisites}
    />
  )
}
  