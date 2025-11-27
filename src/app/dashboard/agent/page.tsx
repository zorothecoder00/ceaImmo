// src/app/dashboard/agent/page.tsx
import {  
  Home,   
  Building,    
  Calendar, 
  Users, 
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
  Square
} from 'lucide-react'
import Link from "next/link"
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
  status: 'Disponible' | 'Réservé' | 'Vendu' | 'En négociation'
  images: string[]
  description: string
  createdAt: string
}

interface Booking {
  id: string
  date: string
  type: string
}

interface DashboardStats {
  totalProperties: number
  activeListings: number
  pendingVisits: number
  totalRevenue: number
}

// Mock data
const mockStats: DashboardStats = {
  totalProperties: 24,
  activeListings: 18,
  pendingVisits: 36,
  totalRevenue: 24500
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Appartement Moderne',
    location: '15 Rue Saint-Paul, Paris',
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    type: 'Appartement',
    status: 'Disponible',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
    description: 'Bel appartement rénové dans le Marais',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Villa de Luxe',
    location: '8 Avenue des Pins, Nice',
    price: 1450000,
    bedrooms: 5,
    bathrooms: 3,
    area: 200,
    type: 'Villa',
    status: 'En négociation',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'],
    description: 'Villa avec vue mer exceptionnelle',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    title: 'Studio Centre-ville',
    location: '12 Rue de la République, Lyon',
    price: 180000,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    type: 'Studio',
    status: 'Réservé',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
    description: 'Studio moderne en plein centre',
    createdAt: '2024-01-28'
  }
]

const recentBookings = [
  {
    id: '1',
    type: 'Visite Appartement - Famille Durand',
    date: '12 Mars 2024 - 14:30',
    status: 'confirmed'
  },
  {
    id: '2',
    type: 'Signature Contrat - M. Martin',
    date: '15 Mars 2024 - 10:00', 
    status: 'pending'
  },
  {
    id: '3',
    type: 'Visite Virtuelle - Mme Garnier',
    date: '18 Mars 2024 - 16:00',
    status: 'confirmed'
  }
]

// Components
function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon 
}: { 
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: Property }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800'
      case 'Réservé': return 'bg-yellow-100 text-yellow-800'
      case 'En négociation': return 'bg-orange-100 text-orange-800'
      case 'Vendu': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative">
        <div className="relative w-full h-48">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
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
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {property.price.toLocaleString('fr-FR')} €
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{booking.type}</p>
          <p className="text-sm text-gray-600">{booking.date}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Edit className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function AgentDashboard() {
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
                <a href="#" className="text-gray-600 hover:text-gray-900">Biens</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Clients</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Ventes et Locations</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/agent/notifications" className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Link>
              <button className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm">Mon Profil</span>
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
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Thomas Durand</p>
                <p className="text-sm text-gray-600">Agent Immobilier</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6">
              + Tableau de bord
            </button>

            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Home className="h-5 w-5" />
                <span>Accueil</span>
              </a>
              <a href="/dashboard/agent/proprietes" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Building className="h-5 w-5" />
                <span>Propriétés</span>
              </a>
              <a href="/dashboard/agent/clients" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Users className="h-5 w-5" />
                <span>Mes clients</span>
              </a>
              <a href="/dashboard/agent/visites" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Calendar className="h-5 w-5" />
                <span>Rendez-vous</span>
              </a>
              <a href="/dashboard/agent/messages" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <FileText className="h-5 w-5" />
                <span>Messagerie</span>
              </a>
              <a href="/dashboard/agent/ventesEtLocations" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
                <Settings className="h-5 w-5" />
                <span>Ventes et locations</span>
              </a>
            </nav>
          </div>
        </aside>  

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord Agent</h1>
            <p className="text-gray-600">Découvrez l&apos;activité récente de votre portefeuille et explorez vos performances</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Propriétés"
              value={mockStats.totalProperties}
              subtitle="au total"
              icon={Building}
            />
            <StatsCard
              title="Annonces"
              value={mockStats.activeListings}
              subtitle="en ligne"
              icon={FileText}
            />
            <StatsCard
              title="Visites"
              value={mockStats.pendingVisits}
              subtitle="à planifier"
              icon={Calendar}
            />
            <StatsCard
              title="Revenus"
              value={`${mockStats.totalRevenue.toLocaleString('fr-FR')} €`}
              subtitle="ce mois"
              icon={Home}
            />
          </div>

          {/* Properties Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Propriétés Récentes</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ventes et Locations:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option>Tous</option>
                    <option>Vente</option>
                    <option>Location</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Types de Propriétés:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option>Tous</option>
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Villa</option>
                  </select>
                </div>
                <button className="text-blue-600 text-sm font-medium">Voir tout</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Rendez-vous à venir</h2>
              <button className="text-blue-600 text-sm font-medium">Voir tout</button>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}