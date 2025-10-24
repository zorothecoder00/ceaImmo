// src/app/dashboard/acheteur/page.tsx
import {    
  Home, 
 
  Calendar, 

  FileText, 
  Settings, 
  Bell,
  User,
  Eye,
  Edit,
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Search,

  Star,
  Phone,
  Mail,

} from 'lucide-react'
import Link from "next/link"  

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
  images: string[]
  description: string
  agent: string
  rating: number
  isFavorite: boolean
}

interface SavedSearch {
  id: string
  name: string
  criteria: string
  results: number
  createdAt: string
}

interface Visit {
  id: string
  propertyTitle: string
  date: string
  time: string
  agent: string
  status: 'Planifié' | 'Confirmé' | 'Terminé'
}

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Appartement Lumineux Centre-ville',
    location: '15 Rue Saint-Paul, Paris 4e',
    price: 485000,
    bedrooms: 3,
    bathrooms: 2,
    area: 75,
    type: 'Appartement',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
    description: 'Magnifique appartement rénové avec balcon',
    agent: 'Sophie Martin',
    rating: 4.8,
    isFavorite: true
  },
  {
    id: '2',
    title: 'Maison avec Jardin',
    location: '8 Avenue des Tilleuls, Boulogne',
    price: 720000,
    bedrooms: 4,
    bathrooms: 2,
    area: 120,
    type: 'Maison',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'],
    description: 'Belle maison familiale avec jardin privatif',
    agent: 'Thomas Durand',
    rating: 4.9,
    isFavorite: false
  },
  {
    id: '3',
    title: 'Studio Moderne Montparnasse',
    location: '12 Rue de la Gaîté, Paris 14e',
    price: 295000,
    bedrooms: 1,
    bathrooms: 1,
    area: 28,
    type: 'Studio',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
    description: 'Studio refait à neuf, proche métro',
    agent: 'Marie Dubois',
    rating: 4.6,
    isFavorite: true
  }
]

const savedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Appartement 3P Paris',
    criteria: '3 pièces, Paris, 400k-600k€',
    results: 12,
    createdAt: '2024-03-01'
  },
  {
    id: '2', 
    name: 'Maison Banlieue Sud',
    criteria: 'Maison, Banlieue Sud, jardin',
    results: 8,
    createdAt: '2024-02-28'
  }
]

const upcomingVisits: Visit[] = [
  {
    id: '1',
    propertyTitle: 'Appartement Lumineux Centre-ville',
    date: '15 Mars 2024',
    time: '14:30',
    agent: 'Sophie Martin',
    status: 'Confirmé'
  },
  {
    id: '2',
    propertyTitle: 'Maison avec Jardin',
    date: '18 Mars 2024', 
    time: '10:00',
    agent: 'Thomas Durand',
    status: 'Planifié'
  }
]

// Components
function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'blue'
}: { 
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  color?: string
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
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] ?? ""}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button className={`absolute top-3 right-3 p-2 rounded-full ${property.isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
          <Heart className="h-4 w-4" fill={property.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium">
          {property.type}
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

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
          <span>{property.rating}</span>
          <span className="mx-2">•</span>
          <span>Agent: {property.agent}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {property.price.toLocaleString('fr-FR')} €
          </span>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Visiter
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedSearchCard({ search }: { search: SavedSearch }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{search.name}</h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{search.criteria}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">{search.results} résultats</span>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Voir les résultats
        </button>
      </div>
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-100 text-green-800'
      case 'Planifié': return 'bg-blue-100 text-blue-800'
      case 'Terminé': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{visit.propertyTitle}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {visit.date} à {visit.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {visit.agent}
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
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function AcheteurDashboard() {
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
                <a href="#" className="text-gray-600 hover:text-gray-900">Rechercher</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Favoris</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Visites</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/acheteur/notifications" className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Link>
              <button className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm">Marie Petit</span>
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
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Marie Petit</p>
                <p className="text-sm text-gray-600">Acheteur</p>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6">
              + Nouvelle recherche
            </button>

            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Home className="h-5 w-5" />
                <span>Tableau de bord</span>
              </a>
              <a href="/dashboard/acheteur/recherches" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Search className="h-5 w-5" />
                <span>Rechercher</span>
              </a>
              <a href="/dashboard/acheteur/favoris" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Heart className="h-5 w-5" />
                <span>Mes favoris</span>  
              </a> 
              <a href="/dashboard/acheteur/visites" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Calendar className="h-5 w-5" />
                <span>Mes visites</span>
              </a>
              <a href="/dashboard/acheteur/offres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <FileText className="h-5 w-5" />
                <span>Mes offres</span>   
              </a>
              <a href="/dashboard/acheteur/parametres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bonjour Marie !</h1>
            <p className="text-gray-600">Voici un aperçu de vos recherches et de vos biens favoris</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Biens favoris"
              value={15}
              subtitle="sauvegardés"
              icon={Heart}
              color="green"
            />
            <StatsCard
              title="Recherches"
              value={3}
              subtitle="actives"
              icon={Search}
              color="blue"
            />
            <StatsCard
              title="Visites"
              value={5}
              subtitle="planifiées"
              icon={Calendar}
              color="purple"
            />
            <StatsCard
              title="Alertes"
              value={8}
              subtitle="nouvelles"
              icon={Bell}
              color="orange"
            />
          </div>

          {/* Quick Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recherche rapide</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Où souhaitez-vous habiter ?" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Type</option>
                <option>Appartement</option>
                <option>Maison</option>
                <option>Villa</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Budget</option>
                <option>0-300k€</option>
                <option>300k-500k€</option>
                <option>500k€+</option>
              </select>
              <button className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700">
                Rechercher
              </button>
            </div>
          </div>

          {/* Recommended Properties */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommandations pour vous</h2>
              <button className="text-green-600 text-sm font-medium">Voir tout</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saved Searches */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes recherches sauvegardées</h2>
                <button className="text-green-600 text-sm font-medium">Voir tout</button>
              </div>

              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <SavedSearchCard key={search.id} search={search} />
                ))}
              </div>
            </div>

            {/* Upcoming Visits */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Prochaines visites</h2>
                <button className="text-green-600 text-sm font-medium">Voir tout</button>
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