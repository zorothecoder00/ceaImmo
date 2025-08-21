// src/app/dashboard/entreprise/page.tsx
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
  MapPin,
  Bed,
  Bath,
  Square,
  TrendingUp,
  Euro,
  Star,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Briefcase,
  Target,
  Award
} from 'lucide-react'

// Types
interface Agent {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  propertiesManaged: number
  salesThisMonth: number
  rating: number
  status: 'Actif' | 'Inactif' | 'En congé'
}

interface Property {
  id: string
  title: string
  location: string  
  price: number
  type: 'Appartement' | 'Maison' | 'Villa' | 'Studio'
  status: 'En ligne' | 'Vendu' | 'Sous offre' | 'Retiré'
  agent: string
  views: number
  daysOnMarket: number
}

interface CompanyStats {
  totalAgents: number
  activeProperties: number
  salesThisMonth: number
  totalRevenue: number
  averageDaysOnMarket: number
  customerSatisfaction: number
}

interface RecentActivity {
  id: string
  type: 'sale' | 'listing' | 'visit' | 'offer'
  description: string
  agent: string
  time: string
  amount?: number
}

// Mock data
const companyStats: CompanyStats = {
  totalAgents: 12,
  activeProperties: 156,
  salesThisMonth: 24,
  totalRevenue: 2450000,
  averageDaysOnMarket: 18,
  customerSatisfaction: 4.7
}

const topAgents: Agent[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@ceaimmo.fr',
    phone: '+33 1 42 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c27fa4a2?w=100&h=100&fit=crop&crop=face',
    propertiesManaged: 23,
    salesThisMonth: 8,
    rating: 4.9,
    status: 'Actif'
  },
  {
    id: '2',
    name: 'Thomas Durand',
    email: 'thomas.durand@ceaimmo.fr',
    phone: '+33 1 42 34 56 79',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    propertiesManaged: 19,
    salesThisMonth: 6,
    rating: 4.8,
    status: 'Actif'
  },
  {
    id: '3',
    name: 'Marie Dubois',
    email: 'marie.dubois@ceaimmo.fr',
    phone: '+33 1 42 34 56 80',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    propertiesManaged: 21,
    salesThisMonth: 5,
    rating: 4.7,
    status: 'En congé'
  }
]

const recentProperties: Property[] = [
  {
    id: '1',
    title: 'Penthouse Luxe',
    location: 'Avenue Montaigne, Paris 8e',
    price: 2500000,
    type: 'Appartement',
    status: 'En ligne',
    agent: 'Sophie Martin',
    views: 342,
    daysOnMarket: 5
  },
  {
    id: '2',
    title: 'Villa Contemporaine',
    location: 'Neuilly-sur-Seine',
    price: 1800000,
    type: 'Villa',
    status: 'Sous offre',
    agent: 'Thomas Durand',
    views: 156,
    daysOnMarket: 12
  },
  {
    id: '3',
    title: 'Loft Artistique',
    location: 'Le Marais, Paris 3e',
    price: 850000,
    type: 'Appartement',
    status: 'Vendu',
    agent: 'Marie Dubois',
    views: 298,
    daysOnMarket: 8
  }
]

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'sale',
    description: 'Vente finalisée - Loft Artistique',
    agent: 'Marie Dubois',
    time: '2h',
    amount: 850000
  },
  {
    id: '2',
    type: 'listing',
    description: 'Nouvelle annonce - Penthouse Luxe',
    agent: 'Sophie Martin',
    time: '4h'
  },
  {
    id: '3',
    type: 'offer',
    description: 'Offre reçue - Villa Contemporaine',
    agent: 'Thomas Durand',
    time: '6h',
    amount: 1750000
  },
  {
    id: '4',
    type: 'visit',
    description: 'Visite planifiée - Appartement Haussmannien',
    agent: 'Sophie Martin',
    time: '1j'
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
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600'
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

function AgentCard({ agent }: { agent: Agent }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800'
      case 'Inactif': return 'bg-red-100 text-red-800'
      case 'En congé': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{agent.rating}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
          {agent.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {agent.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MessageSquare className="h-4 w-4 mr-2" />
          {agent.email}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">{agent.propertiesManaged}</div>
          <div className="text-xs text-gray-600">Biens gérés</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{agent.salesThisMonth}</div>
          <div className="text-xs text-gray-600">Ventes ce mois</div>
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
          <div className="text-lg font-bold text-gray-900 mb-2">
            {property.price.toLocaleString('fr-FR')} €
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Agent: {property.agent}</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {property.views}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {property.daysOnMarket}j
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({ activity }: { activity: RecentActivity }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'listing': return <Building className="h-5 w-5 text-blue-600" />
      case 'offer': return <Euro className="h-5 w-5 text-orange-600" />
      case 'visit': return <Calendar className="h-5 w-5 text-purple-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{activity.description}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{activity.agent}</span>
          <span>
            {activity.amount ? activity.amount.toLocaleString('fr-FR') + ' €' : activity.time}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardEntreprise() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard title="Agents" value={companyStats.totalAgents} subtitle="Total agents" icon={Users} color="blue" />
        <StatsCard title="Biens actifs" value={companyStats.activeProperties} subtitle="Biens en ligne" icon={Building} color="green" />
        <StatsCard title="Ventes ce mois" value={companyStats.salesThisMonth} subtitle="Ventes conclues" icon={CheckCircle} color="purple" />
        <StatsCard title="Chiffre d'affaires" value={companyStats.totalRevenue.toLocaleString('fr-FR') + ' €'} subtitle="Revenu total" icon={Euro} color="orange" />
        <StatsCard title="Durée moyenne" value={companyStats.averageDaysOnMarket + 'j'} subtitle="Moyenne jours sur le marché" icon={Clock} color="indigo" />
        <StatsCard title="Satisfaction clients" value={companyStats.customerSatisfaction + ' ⭐'} subtitle="Note moyenne" icon={Star} color="red" />
      </div>

      {/* Top Agents */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Recent Properties */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Biens récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>  

      {/* Recent Activities */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activités récentes</h2>
        <div className="space-y-2">
          {recentActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  )
}
