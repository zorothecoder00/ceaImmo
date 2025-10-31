// src/app/dashboard/vendeur/page.tsx
'use client'

import { useState } from 'react'
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

// Types
interface Property {
  id: string
  title: string
  location: string  
  price: number
  bedrooms: number  
  bathrooms: number
  area: number
  type: 'Appartement' | 'Maison' | 'Villa' | 'Studio'
  status: 'En ligne' | 'Vendu' | 'Sous offre' | 'Retiré'
  images: string[]
  views: number
  favorites: number
  visits: number
  offers: number
  daysOnMarket: number
  agent: string
}

interface Offer {
  id: string
  buyerName: string
  amount: number
  originalPrice: number
  status: 'En attente' | 'Acceptée' | 'Refusée' | 'Négociation'
  date: string
  propertyTitle: string
}

interface Visit {
  id: string
  buyerName: string
  buyerPhone: string
  date: string
  time: string
  propertyTitle: string
  status: 'Planifiée' | 'Confirmée' | 'Terminée'
}

interface PropertyImage {
  file?: File
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
  description: string
  categorie: string
  prix: string
  surface: string
  statut: string
  geolocalisation: string
  nombreChambres: string
  visiteVirtuelle: string
}

// Mock data
const myProperties: Property[] = [
  {
    id: '1',
    title: 'Appartement Haussmannien',
    location: '16 Boulevard Saint-Germain, Paris 5e',
    price: 650000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    type: 'Appartement',
    status: 'En ligne',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
    views: 245,
    favorites: 28,
    visits: 12,
    offers: 3,
    daysOnMarket: 15,
    agent: 'Sophie Martin'
  },
  {
    id: '2',
    title: 'Maison Familiale',
    location: '8 Rue des Lilas, Vincennes',
    price: 850000,
    bedrooms: 5,
    bathrooms: 3,
    area: 150,
    type: 'Maison',
    status: 'Sous offre',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'],
    views: 180,
    favorites: 35,
    visits: 18,
    offers: 2,
    daysOnMarket: 8,
    agent: 'Thomas Durand'
  },
  {
    id: '3',
    title: 'Studio Moderne',
    location: '45 Rue de Belleville, Paris 20e',
    price: 320000,
    bedrooms: 1,
    bathrooms: 1,
    area: 32,
    type: 'Studio',
    status: 'Vendu',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
    views: 156,
    favorites: 22,
    visits: 8,
    offers: 1,
    daysOnMarket: 5,
    agent: 'Marie Dubois'
  }
]

const recentOffers: Offer[] = [
  {
    id: '1',
    buyerName: 'M. et Mme Leroy',
    amount: 620000,
    originalPrice: 650000,
    status: 'En attente',
    date: '12 Mars 2024',
    propertyTitle: 'Appartement Haussmannien'
  },
  {
    id: '2',
    buyerName: 'Famille Garcia',
    amount: 800000,
    originalPrice: 850000,
    status: 'Négociation',
    date: '10 Mars 2024',
    propertyTitle: 'Maison Familiale'
  },
  {
    id: '3',
    buyerName: 'Mlle Chen',
    amount: 320000,
    originalPrice: 320000,
    status: 'Acceptée',
    date: '8 Mars 2024',
    propertyTitle: 'Studio Moderne'
  }
]

const upcomingVisits: Visit[] = [
  {
    id: '1',
    buyerName: 'M. Dubois',
    buyerPhone: '+33 6 12 34 56 78',
    date: '15 Mars 2024',
    time: '14:30',
    propertyTitle: 'Appartement Haussmannien',
    status: 'Confirmée'
  },
  {
    id: '2',
    buyerName: 'Mme Rodriguez',
    buyerPhone: '+33 6 87 65 43 21',
    date: '16 Mars 2024',
    time: '10:00',
    propertyTitle: 'Maison Familiale',
    status: 'Planifiée'
  }
]

const categories = ['TERRAIN', 'MAISON', 'APPARTEMENT', 'VILLA', 'COMMERCE', 'BUREAU', 'HOTEL']
const statuts = ['DISPONIBLE', 'RESERVE', 'VENDU', 'LOUE']

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En ligne': return 'bg-green-100 text-green-800'
      case 'Sous offre': return 'bg-orange-100 text-orange-800'
      case 'Vendu': return 'bg-blue-100 text-blue-800'
      case 'Retiré': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Vendu': return <CheckCircle className="h-4 w-4" />
      case 'Sous offre': return <Clock className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative">
        <Image
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(property.status)}`}>
          {getStatusIcon(property.status)}
          {property.status}
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {property.daysOnMarket}j
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area}m²
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-4">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{property.views}</div>
            <div>Vues</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{property.favorites}</div>
            <div>Favoris</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{property.visits}</div>
            <div>Visites</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{property.offers}</div>
            <div>Offres</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {property.price.toLocaleString('fr-FR')} €
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
          Agent: {property.agent}
        </div>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800'
      case 'Acceptée': return 'bg-green-100 text-green-800'
      case 'Refusée': return 'bg-red-100 text-red-800'
      case 'Négociation': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const discount = ((offer.originalPrice - offer.amount) / offer.originalPrice * 100).toFixed(1)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{offer.buyerName}</h3>
          <p className="text-sm text-gray-600 mb-2">{offer.propertyTitle}</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {offer.amount.toLocaleString('fr-FR')} €
            </span>
            <span className="text-sm text-gray-500">
              (-{discount}%)
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
          {offer.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{offer.date}</span>
        <div className="flex items-center space-x-2">
          {offer.status === 'En attente' && (
            <>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700">
                Accepter
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300">
                Négocier
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmée': return 'bg-green-100 text-green-800'
      case 'Planifiée': return 'bg-blue-100 text-blue-800'
      case 'Terminée': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{visit.buyerName}</h3>
          <p className="text-sm text-gray-600 mb-2">{visit.propertyTitle}</p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {visit.date} à {visit.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {visit.buyerPhone}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
            {visit.status}
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
export default function VendeurDashboard() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    description: '',
    categorie: 'TERRAIN',
    prix: '',
    surface: '',
    statut: 'DISPONIBLE',
    geolocalisation: '',
    nombreChambres: '1',
    visiteVirtuelle: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<PropertyImage[]>([])
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeProperties = myProperties.filter(p => p.status === 'En ligne' || p.status === 'Sous offre').length
  const soldProperties = myProperties.filter(p => p.status === 'Vendu').length
  const totalViews = myProperties.reduce((sum, p) => sum + p.views, 0)
  const pendingOffers = recentOffers.filter(o => o.status === 'En attente').length

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: PropertyImage[] = Array.from(files).map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        ordre: images.length + index
      }))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addChambre = () => {
    setChambres([...chambres, {
      nom: '',
      description: '',
      prixParNuit: '',
      capacite: '2',
      disponible: true
    }])
  }

  const removeChambre = (index: number) => {
    setChambres(chambres.filter((_, i) => i !== index))
  }

  const updateChambre = (index: number, field: string, value: string | boolean) => {
    const updated = [...chambres]
    updated[index] = { ...updated[index], [field]: value }
    setChambres(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulation d'upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newBien = {
      id: Date.now(),
      nom: formData.nom,
      description: formData.description,
      categorie: formData.categorie,
      prix: parseInt(formData.prix),
      surface: parseInt(formData.surface),
      statut: formData.statut,
      geolocalisation: formData.geolocalisation,
      chambres: chambres,
      nombreChambres: parseInt(formData.nombreChambres),
      images: images.map((img, index) => ({
        id: Date.now() + index,
        url: img.url,
        ordre: img.ordre
      })),
      visiteVirtuelle: formData.visiteVirtuelle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    console.log('Nouveau bien créé:', newBien)
    
    setIsSubmitting(false)
    setShowModal(false)
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      description: '',
      categorie: 'TERRAIN',
      prix: '',
      surface: '',
      statut: 'DISPONIBLE',
      geolocalisation: '',
      nombreChambres: '1',
      visiteVirtuelle: ''
    })
    setImages([])
    setChambres([])
    setCurrentStep(1)
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.nom && formData.categorie && formData.prix && formData.surface && formData.geolocalisation
    }
    if (currentStep === 2) {
      return images.length > 0
    }
    return true
  }

  const handleAddNew = () => {
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">CEA IMMO</h1>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Accueil</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Mes biens</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Offres</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Visites</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/vendeur/notifications" className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {pendingOffers}
                </span>
              </Link>
              <button className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm">Jean Moreau</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Jean Moreau</p>
                <p className="text-sm text-gray-600">Vendeur</p>
              </div>
            </div>

            <button 
              onClick={handleAddNew}
              className="w-full bg-orange-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6 hover:bg-orange-700 transition-colors">
              + Ajouter un bien
            </button>

            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Home className="h-5 w-5" />
                <span>Tableau de bord</span>
              </a>
              <a href="/dashboard/vendeur/mesBiens" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Building className="h-5 w-5" />
                <span>Mes biens</span>
              </a>
              <a href="/dashboard/vendeur/offres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Euro className="h-5 w-5" />
                <span>Offres reçues</span>
              </a>
              <a href="/dashboard/vendeur/visites" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Calendar className="h-5 w-5" />
                <span>Visites</span>
              </a>
              <a href="/dashboard/vendeur/statistiques" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <TrendingUp className="h-5 w-5" />
                <span>Statistiques</span>
              </a>
              <a href="/dashboard/vendeur/parametres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </a>
            </nav>
          </div>
        </aside>  

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bonjour Jean !</h1>
            <p className="text-gray-600">Suivez les performances de vos biens et gérez vos ventes</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Biens actifs"
              value={activeProperties}
              subtitle="en ligne"
              icon={Building}
              color="orange"
              trend="+2 cette semaine"
            />
            <StatsCard
              title="Biens vendus"
              value={soldProperties}
              subtitle="ce mois"
              icon={CheckCircle}
              color="green"
            />
            <StatsCard
              title="Vues totales"
              value={totalViews}
              subtitle="sur tous vos biens"
              icon={Eye}
              color="blue"
              trend="+15%"
            />
            <StatsCard
              title="Offres en attente"
              value={pendingOffers}
              subtitle="à traiter"
              icon={Euro}
              color="purple"
            />
          </div>

          {/* My Properties */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mes biens</h2>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Tous les statuts</option>
                  <option>En ligne</option>
                  <option>Sous offre</option>
                  <option>Vendu</option>
                </select>
                <button className="text-orange-600 text-sm font-medium">Voir tout</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Offers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Offres récentes</h2>
                <button className="text-orange-600 text-sm font-medium">Voir tout</button>
              </div>

              <div className="space-y-4">
                {recentOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>

            {/* Upcoming Visits */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Prochaines visites</h2>
                <button className="text-orange-600 text-sm font-medium">Voir tout</button>
              </div>

              <div className="space-y-4">
                {upcomingVisits.map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

    {/* Modal d'ajout */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Ajouter une propriété</h2>
                    <p className="text-orange-100 text-sm mt-1">
                      Étape {currentStep} sur 3
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-6 flex gap-2">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        step <= currentStep ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                {/* Étape 1: Informations principales */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de la propriété *
                        </label>
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Villa Moderne Lomé"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          value={formData.categorie}
                          onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Sélectionner...</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          value={formData.prix}
                          onChange={(e) => setFormData({...formData, prix: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="150000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surface (m²) *
                        </label>
                        <input
                          type="number"
                          value={formData.surface}
                          onChange={(e) => setFormData({...formData, surface: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="350"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={formData.statut}
                          onChange={(e) => setFormData({...formData, statut: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          {statuts.map(statut => (
                            <option key={statut} value={statut}>{statut.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de chambres *
                        </label>
                        <input
                          type="number"
                          value={formData.nombreChambres}
                          onChange={(e) => setFormData({...formData, nombreChambres: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Géolocalisation *
                      </label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.geolocalisation}
                          onChange={(e) => setFormData({...formData, geolocalisation: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Lomé, Bè"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                        placeholder="Décrivez votre propriété..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lien visite virtuelle (optionnel)
                      </label>
                      <input
                        type="url"
                        value={formData.visiteVirtuelle}
                        onChange={(e) => setFormData({...formData, visiteVirtuelle: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Étape 2: Images */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Photos de la propriété *
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 font-medium mb-2">
                            Cliquez pour ajouter des photos
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG jusqu&apos;à 10MB
                          </p>
                        </label>
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          {images.map((img, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={img.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                #{index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Étape 3: Chambres (optionnel) */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Chambres (Optionnel)
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pour les hôtels et locations de courte durée
                        </p>
                      </div>
                      <Button
                        onClick={addChambre}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus size={16} className="mr-1" /> Ajouter
                      </Button>
                    </div>

                    {chambres.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Bed className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">Aucune chambre ajoutée</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Vous pouvez passer cette étape si non applicable
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chambres.map((chambre, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-medium text-gray-900">Chambre {index + 1}</h4>
                              <button
                                onClick={() => removeChambre(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={chambre.nom}
                                onChange={(e) => updateChambre(index, 'nom', e.target.value)}
                                placeholder="Nom de la chambre"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="number"
                                value={chambre.capacite}
                                onChange={(e) => updateChambre(index, 'capacite', e.target.value)}
                                placeholder="Capacité"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="number"
                                value={chambre.prixParNuit}
                                onChange={(e) => updateChambre(index, 'prixParNuit', e.target.value)}
                                placeholder="Prix/nuit (FCFA)"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2"
                              />
                              <textarea
                                value={chambre.description}
                                onChange={(e) => updateChambre(index, 'description', e.target.value)}
                                placeholder="Description"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2 h-20 resize-none"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setShowModal(false)}
                  >
                    {currentStep === 1 ? 'Annuler' : 'Précédent'}
                  </Button>

                  <div className="flex gap-2">
                    {!isStepValid() && currentStep !== 3 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 mr-4">
                        <AlertCircle size={16} />
                        Veuillez remplir tous les champs requis
                      </div>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepValid()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={16} />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
  