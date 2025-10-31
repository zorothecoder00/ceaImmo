'use client'

import { 
  Home, 
  Building, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  Eye,
  MapPin,
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
  Menu,
  X,
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  LogOut,
  HelpCircle   
} from 'lucide-react'
import { useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { ReactNode } from 'react'
import Image from 'next/image'

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

interface SidebarProps {
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

interface HeaderProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

interface ChartCardProps {
  title: string
  children: ReactNode
  actions?: ReactNode
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
  },
  {
    id: '4',
    title: 'Studio Moderne',
    location: 'Bastille, Paris 11e',
    price: 450000,
    type: 'Studio',
    status: 'En ligne',
    agent: 'Sophie Martin',
    views: 89,
    daysOnMarket: 3
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
  },
  {
    id: '5',
    type: 'listing',
    description: 'Mise à jour annonce - Studio Moderne',
    agent: 'Thomas Durand',
    time: '2j'
  }
]

const chartData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 1800000 },
    { month: 'Fév', revenue: 2100000 },
    { month: 'Mar', revenue: 2450000 },
    { month: 'Avr', revenue: 2200000 },
    { month: 'Mai', revenue: 2600000 },
    { month: 'Juin', revenue: 2450000 }
  ],
  propertyTypes: [
    { type: 'Appartement', count: 78, percentage: 50 },
    { type: 'Maison', count: 43, percentage: 28 },
    { type: 'Villa', count: 25, percentage: 16 },
    { type: 'Studio', count: 10, percentage: 6 }
  ]
}

// Components
function Sidebar({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'properties', label: 'Propriétés', icon: Building },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'analytics', label: 'Analyses', icon: PieChart },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CEA Immobilier</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-colors ${
                  activeMenu === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Jean Directeur</p>
              <p className="text-xs text-gray-500">Directeur Général</p>
            </div>
          </div>
          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <LogOut className="h-4 w-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  )
}

function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-500">{subtitle}</p>
            {trend && (
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
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

function ChartCard({ title, children, actions }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function RevenueChart() {
  const maxRevenue = Math.max(...chartData.monthlyRevenue.map(d => d.revenue))
  
  return (
    <div className="space-y-4">
      {chartData.monthlyRevenue.map((data) => (
        <div key={data.month} className="flex items-center space-x-4">
          <div className="w-8 text-sm text-gray-600">{data.month}</div>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-20 text-sm text-gray-900 text-right">
            {(data.revenue / 1000000).toFixed(1)}M€
          </div>
        </div>
      ))}
    </div>
  )
}

function PropertyTypeChart() {
  return (
    <div className="space-y-3">
      {chartData.propertyTypes.map((type) => (
        <div key={type.type} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              type.type === 'Appartement' ? 'bg-blue-500' :
              type.type === 'Maison' ? 'bg-green-500' :
              type.type === 'Villa' ? 'bg-purple-500' : 'bg-orange-500'
            }`} />
            <span className="text-sm text-gray-600">{type.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{type.count}</span>
            <span className="text-xs text-gray-500">({type.percentage}%)</span>
          </div>
        </div>
      ))}
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image 
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
          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{agent.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{agent.email}</span>
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
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
        <span className="truncate">{property.agent}</span>
        <div className="flex items-center space-x-4 flex-shrink-0">
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
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{activity.description}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="truncate">{activity.agent}</span>
          <span className="flex-shrink-0 ml-2">
            {activity.amount ? activity.amount.toLocaleString('fr-FR') + ' €' : activity.time}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function EnterpriseDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <StatsCard
              title="Agents Actifs"
              value={companyStats.totalAgents}
              subtitle="Équipe complète"
              icon={Users}
              color="blue"
              trend="+2"
            />
            <StatsCard
              title="Propriétés"
              value={companyStats.activeProperties}
              subtitle="Annonces actives"
              icon={Building}
              color="green"
              trend="+12"
            />
            <StatsCard
              title="Ventes Mensuelles"
              value={companyStats.salesThisMonth}
              subtitle="Ce mois-ci"
              icon={Target}
              color="purple"
              trend="+8%"
            />
            <StatsCard
              title="Chiffre d'Affaires"
              value={`${(companyStats.totalRevenue / 1000000).toFixed(1)}M€`}
              subtitle="Revenue total"
              icon={Euro}
              color="orange"
              trend="+15%"
            />
            <StatsCard
              title="Temps Moyen"
              value={`${companyStats.averageDaysOnMarket}j`}
              subtitle="Sur le marché"
              icon={Clock}
              color="indigo"
              trend="-3j"
            />
            <StatsCard
              title="Satisfaction"
              value={companyStats.customerSatisfaction}
              subtitle="Note moyenne"
              icon={Star}
              color="green"
              trend="+0.2"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="Évolution du Chiffre d'Affaires"
              actions={
                <>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                </>
              }
            >
              <RevenueChart />
            </ChartCard>
            
            <ChartCard 
              title="Répartition par Type de Bien"
              actions={
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Voir détail
                </button>
              }
            >
              <PropertyTypeChart />
            </ChartCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Agents Performance */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Agents</h3>
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Voir tous
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {topAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Properties & Activities */}
            <div className="xl:col-span-2 space-y-6">
              {/* Recent Properties */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Propriétés Récentes</h3>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle annonce
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {recentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Voir tout
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recentActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Plus className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Nouvelle Propriété</span>
                </button>
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Users className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Ajouter Agent</span>
                </button>
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Programmer Visite</span>
                </button>
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <BarChart3 className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Rapport Mensuel</span>
                </button>
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Contrats</span>
                </button>
                <button className="flex flex-col items-center p-4 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Settings className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Paramètres</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Ventes</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Objectif Mensuel</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">24 / 30</div>
                      <div className="text-xs text-gray-500">80% atteint</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Ventes Trimestre</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">68 / 90</div>
                      <div className="text-xs text-gray-500">76% atteint</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Taux de Conversion</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">15.4%</div>
                      <div className="text-xs text-green-600">+2.3%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse du Marché</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Prix Moyen m²</span>
                      <span className="text-sm font-bold text-gray-900">8 450€</span>
                    </div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3.2% ce mois
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Demande Locative</span>
                      <span className="text-sm font-bold text-gray-900">Forte</span>
                    </div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% demandes
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Concurrence</span>
                      <span className="text-sm font-bold text-gray-900">Modérée</span>
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <Activity className="h-3 w-3 mr-1" />
                      Position stable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Événements à Venir</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Voir calendrier
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Réunion Équipe</h4>
                      <p className="text-xs text-gray-500 mt-1">Aujourd&apos;hui 14:00</p>
                      <p className="text-xs text-gray-600 mt-2">Révision objectifs Q2</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Formation Agents</h4>
                      <p className="text-xs text-gray-500 mt-1">Demain 09:00</p>
                      <p className="text-xs text-gray-600 mt-2">Nouveaux outils CRM</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Salon Immobilier</h4>
                      <p className="text-xs text-gray-500 mt-1">Vendredi 10:00</p>
                      <p className="text-xs text-gray-600 mt-2">Porte de Versailles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}