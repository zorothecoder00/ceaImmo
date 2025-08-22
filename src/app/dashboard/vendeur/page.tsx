// src/app/dashboard/vendeur/page.tsx
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
  CheckCircle
} from 'lucide-react'

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
        <img
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
  const activeProperties = myProperties.filter(p => p.status === 'En ligne' || p.status === 'Sous offre').length
  const soldProperties = myProperties.filter(p => p.status === 'Vendu').length
  const totalViews = myProperties.reduce((sum, p) => sum + p.views, 0)
  const pendingOffers = recentOffers.filter(o => o.status === 'En attente').length

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
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {pendingOffers}
                </span>
              </button>
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

            <button className="w-full bg-orange-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6">
              + Ajouter un bien
            </button>

            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Home className="h-5 w-5" />
                <span>Tableau de bord</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Building className="h-5 w-5" />
                <span>Mes biens</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Euro className="h-5 w-5" />
                <span>Offres reçues</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Calendar className="h-5 w-5" />
                <span>Visites</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <TrendingUp className="h-5 w-5" />
                <span>Statistiques</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
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
    </div>
  )
}