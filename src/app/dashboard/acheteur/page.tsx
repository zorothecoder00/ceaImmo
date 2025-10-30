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
import { getAuthSession } from "@/lib/auth"
import Link from "next/link"  
import {
  getAvailableProprietes,
  filtrageProprietes,
  getMesProchainesVisites,
  getMesFavoris,
  toggleFavori
} from '@/lib/getDashboardAcheteur'
import FavoriteButton from '@/components/FavoriteButton'
import { Categorie, VisiteStatut } from '@prisma/client'

// Types
interface Image {
  id: number
  url: string
  ordre: number
}

interface Property {
  id: number
  nom: string
  geolocalisation: string  
  prix: number|bigint
  nombreChambres: number  
  chambre?: string
  surface: number | bigint
  categorie: Categorie
  images: Image[]
  description: string | null
  agent?: string
  avis?: Avis[]
  isFavorite?: boolean
}

interface Favoris {
  id: number
}

interface Avis {
  id: number
  note: number
}

interface Visit {
  id: number
  propriete: Property | null
  date: Date
  agent: {
    prenom: string
    nom: string
  } | null
  statut: VisiteStatut
}

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

function PropertyCard({ property, userId }: { property: Property, userId: string }) {
  const imageUrl = property.images[0]?.url || '/placeholder-property.jpg'
  const moyenneAvis = property.avis && property.avis.length > 0 
    ? (property.avis.reduce((acc, avis) => acc + avis.note, 0) / property.avis.length).toFixed(1)
    : null

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">   
        <img 
          src={imageUrl} 
          alt={property.nom}    
          className="w-full h-48 object-cover"
        />
        {/* ✅ Bouton favori interactif */}
        <FavoriteButton
          userId={userId}
          proprieteId={Number(property.id)}
          initialFavorite={!!property.isFavorite}
        />
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium">
          {property.categorie} 
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
            {Number(property.surface)} m²
          </div>
        </div>

        {moyenneAvis && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            <span>{moyenneAvis}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {Number(property.prix).toLocaleString('fr-FR')} €
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

function VisitCard({ visit }: { visit: Visit }) {
  const getStatusColor = (statut: VisiteStatut) => {
  switch (statut) {
    case VisiteStatut.CONFIRMEE: return 'bg-green-100 text-green-800'
    case VisiteStatut.DEMANDEE: return 'bg-blue-100 text-blue-800'
    case VisiteStatut.REPORTEE: return 'bg-gray-100 text-gray-800'
    case VisiteStatut.ANNULEE: return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

  const getStatusLabel = (statut: VisiteStatut) => {
  switch (statut) {
    case VisiteStatut.CONFIRMEE: return 'Confirmée'
    case VisiteStatut.DEMANDEE: return 'Planifiée'
    case VisiteStatut.REPORTEE: return 'Terminée'
    case VisiteStatut.ANNULEE: return 'Annulée'
    default: return statut
  }
}


  const dateObj = new Date(visit.date)
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{visit.propriete ? visit.propriete.nom : 'Propriété supprimée'}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {formattedDate} à {formattedTime}
          </div>
          {visit.agent && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              {visit.agent.prenom} {visit.agent.nom}
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
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default async function AcheteurDashboard() {
  const session = await getAuthSession()
  if (!session || !session?.user) {
    return (
      <div className="p-10 text-center text-gray-600">
        Vous devez être connecté pour accéder à ce tableau de bord.
      </div>
    )
  }

  const userId = session?.user?.id.toString()

  // ✅ Chargement parallèle des données
  const [proprietes, visitesData, favorisData] = await Promise.all([
    getAvailableProprietes(userId),
    getMesProchainesVisites(userId),
    getMesFavoris(userId)
  ])

  const { visites, total: totalVisites } = visitesData
  const { favoris, total: totalFavoris } = favorisData

  // Nombre de recherches actives (à implémenter si nécessaire)
  const recherchesActives = 0

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
                <span className="text-sm">Bienvenu(e) {session.user.name ?? 'Acheteur'}</span>
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
                <p className="font-semibold text-gray-900">{session?.user?.name}</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bonjour {session.user.name ?? 'cher utilisateur'} !</h1>
            <p className="text-gray-600">Voici un aperçu de vos recherches et de vos biens favoris</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard title="Biens favoris" value={totalFavoris} subtitle="sauvegardés" icon={Heart} color="green" />
            <StatsCard title="Recherches" value={recherchesActives} subtitle="actives" icon={Search} color="blue" />
            <StatsCard title="Visites" value={totalVisites} subtitle="planifiées" icon={Calendar} color="purple" />
            <StatsCard title="Alertes" value={0} subtitle="nouvelles" icon={Bell} color="orange" />
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

            {proprietes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proprietes.map((property) => (
                  <PropertyCard key={property.id} property={property} userId={userId} />
                ))}
              </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Aucune propriété disponible pour le moment</p>
                </div>
              )}
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saved Searches - À implémenter */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes recherches sauvegardées</h2>
                <button className="text-green-600 text-sm font-medium">Voir tout</button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">Aucune recherche sauvegardée</p>
              </div>
            </div>

            {/* Upcoming Visits */}   
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Prochaines visites</h2>
                <Link href="/dashboard/acheteur/visites" className="text-green-600 text-sm font-medium">
                  Voir tout
                </Link>
              </div>

              {visites.length > 0 ? (
                <div className="space-y-4">
                  {visites.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                </div>
              ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Aucune visite planifiée</p>
                  </div>
                )}
              </div>
            </div>
        </main>
      </div>
    </div>
  )
}