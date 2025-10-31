'use client'

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Plus,  
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  DollarSign,
  Star,
  Heart,
  MessageSquare,
  Camera,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  Target,
  Activity,
  TrendingDown,
  Package
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Image from 'next/image'

interface ProprieteImage {
  id: number;
  url: string;
  ordre: number;
}

interface Offre {
  id: number;
  montant: number;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'EXPIREE';
  message?: string;
  createdAt: string;
}

interface Reservation {
  id: number;
  dateArrivee: string;
  dateDepart: string;
  nombreVoyageurs: number;
  type: 'SEJOUR' | 'LOCATION';
  statut: 'DEMANDEE' | 'CONFIRMEE' | 'ANNULEE' | 'REPORTEE';
}

interface Visite {
  id: number;
  date: string;
  statut: 'DEMANDEE' | 'CONFIRMEE' | 'ANNULEE' | 'REPORTEE';
}

interface Avis {
  id: number;
  note: number;
  commentaire?: string;
  createdAt: string;
}

interface Bien {
  id: number;
  nom: string;
  description: string;
  categorie: string;
  prix: number;
  surface: number;
  statut: string;
  nombreChambres: number;
  geolocalisation: string;
  images: ProprieteImage[];
  visiteVirtuelle: string | null;
  createdAt: string;
  updatedAt: string;
  offres: Offre[];
  reservations: Reservation[];
  favoris: number;
  visites: Visite[];
  avis: Avis[];
}

// Mock data RÉALISTE basé sur le schéma Prisma
const mockBiens: Bien[] = [
  {
    id: 1,
    nom: "Villa Moderne Seaside",
    description: "Magnifique villa avec vue mer, 4 chambres, piscine privée",
    categorie: "VILLA",
    prix: 850000,
    surface: 320,
    statut: "DISPONIBLE",
    nombreChambres: 4,
    geolocalisation: "Lomé, Maritime",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", ordre: 0 },
      { id: 2, url: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800", ordre: 1 }
    ],
    visiteVirtuelle: "https://matterport.com/villa-moderne",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-09-15T14:20:00Z",
    offres: [
      { id: 1, montant: 820000, statut: 'ACCEPTEE', createdAt: "2024-08-10T09:00:00Z" },
      { id: 2, montant: 800000, statut: 'REFUSEE', createdAt: "2024-07-15T14:30:00Z" },
      { id: 3, montant: 830000, statut: 'EN_ATTENTE', createdAt: "2024-10-01T11:20:00Z" }
    ],
    reservations: [
      { id: 1, dateArrivee: "2024-11-01", dateDepart: "2024-11-15", nombreVoyageurs: 6, type: 'SEJOUR', statut: 'CONFIRMEE' },
      { id: 2, dateArrivee: "2024-12-20", dateDepart: "2025-01-05", nombreVoyageurs: 4, type: 'SEJOUR', statut: 'DEMANDEE' }
    ],
    favoris: 34,
    visites: [
      { id: 1, date: "2024-10-20T10:00:00Z", statut: 'DEMANDEE' },
      { id: 2, date: "2024-10-18T15:00:00Z", statut: 'CONFIRMEE' }
    ],
    avis: [
      { id: 1, note: 5, commentaire: "Superbe villa!", createdAt: "2024-09-01T12:00:00Z" },
      { id: 2, note: 4, commentaire: "Très bien située", createdAt: "2024-09-10T16:30:00Z" }
    ]
  },
  {
    id: 2,
    nom: "Appartement Centre-Ville",
    description: "Appartement moderne de 3 pièces, proche commodités",
    categorie: "APPARTEMENT",
    prix: 120000,
    surface: 85,
    statut: "RESERVE",
    nombreChambres: 2,
    geolocalisation: "Lomé Centre",
    images: [
      { id: 3, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", ordre: 0 }
    ],
    visiteVirtuelle: null,
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-09-10T11:45:00Z",
    offres: [
      { id: 4, montant: 115000, statut: 'ACCEPTEE', createdAt: "2024-09-01T10:00:00Z" },
      { id: 5, montant: 110000, statut: 'REFUSEE', createdAt: "2024-08-25T14:00:00Z" },
      { id: 6, montant: 118000, statut: 'EN_ATTENTE', createdAt: "2024-09-28T09:30:00Z" }
    ],
    reservations: [
      { id: 3, dateArrivee: "2024-10-25", dateDepart: "2024-11-25", nombreVoyageurs: 2, type: 'LOCATION', statut: 'CONFIRMEE' }
    ],
    favoris: 18,
    visites: [
      { id: 3, date: "2024-10-22T14:00:00Z", statut: 'CONFIRMEE' }
    ],
    avis: [
      { id: 3, note: 4, commentaire: "Bien situé", createdAt: "2024-09-05T10:00:00Z" }
    ]
  },
  {
    id: 3,
    nom: "Terrain Commercial",
    description: "Terrain de 2000m² idéal pour construction commerciale",
    categorie: "TERRAIN",
    prix: 180000,
    surface: 2000,
    statut: "EN_NEGOCIATION",
    nombreChambres: 0,
    geolocalisation: "Kpalimé",
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", ordre: 0 }
    ],
    visiteVirtuelle: null,
    createdAt: "2024-03-05T14:20:00Z",
    updatedAt: "2024-09-12T16:30:00Z",
    offres: [
      { id: 7, montant: 175000, statut: 'EN_ATTENTE', createdAt: "2024-09-20T11:00:00Z" },
      { id: 8, montant: 170000, statut: 'REFUSEE', createdAt: "2024-09-10T15:00:00Z" }
    ],
    reservations: [],
    favoris: 7,
    visites: [
      { id: 4, date: "2024-10-16T09:00:00Z", statut: 'DEMANDEE' }
    ],
    avis: []
  },
  {
    id: 4,
    nom: "Hôtel Boutique",
    description: "Petit hôtel de charme, 12 chambres, restaurant inclus",
    categorie: "HOTEL",
    prix: 450000,
    surface: 800,
    statut: "DISPONIBLE",
    nombreChambres: 12,
    geolocalisation: "Kara",
    images: [
      { id: 5, url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", ordre: 0 },
      { id: 6, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", ordre: 1 }
    ],
    visiteVirtuelle: "https://matterport.com/hotel-boutique",
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-09-14T10:15:00Z",
    offres: [
      { id: 9, montant: 440000, statut: 'EN_ATTENTE', createdAt: "2024-10-05T10:00:00Z" },
      { id: 10, montant: 435000, statut: 'REFUSEE', createdAt: "2024-09-28T13:00:00Z" }
    ],
    reservations: [
      { id: 4, dateArrivee: "2024-11-10", dateDepart: "2024-11-12", nombreVoyageurs: 2, type: 'SEJOUR', statut: 'CONFIRMEE' },
      { id: 5, dateArrivee: "2024-12-01", dateDepart: "2024-12-03", nombreVoyageurs: 4, type: 'SEJOUR', statut: 'CONFIRMEE' }
    ],
    favoris: 42,
    visites: [
      { id: 5, date: "2024-10-25T11:00:00Z", statut: 'DEMANDEE' },
      { id: 6, date: "2024-10-28T14:00:00Z", statut: 'DEMANDEE' }
    ],
    avis: [
      { id: 4, note: 5, commentaire: "Excellent hôtel", createdAt: "2024-08-15T12:00:00Z" },
      { id: 5, note: 4, commentaire: "Très bon accueil", createdAt: "2024-09-01T10:00:00Z" }
    ]
  }
];

// Données pour les graphiques
const evolutionOffresData = [
  { mois: 'Avr', offres: 12, acceptees: 4 },
  { mois: 'Mai', offres: 19, acceptees: 7 },
  { mois: 'Juin', offres: 15, acceptees: 5 },
  { mois: 'Juil', offres: 22, acceptees: 9 },
  { mois: 'Août', offres: 28, acceptees: 11 },
  { mois: 'Sept', offres: 25, acceptees: 10 },
  { mois: 'Oct', offres: 18, acceptees: 6 }
];

const repartitionStatutsData = [
  { name: 'Disponible', value: 2, color: '#10b981' },
  { name: 'Réservé', value: 1, color: '#f59e0b' },
  { name: 'En Négociation', value: 1, color: '#3b82f6' }
];

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number | string;
  change?: number;
  color?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color = "blue", subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {change !== undefined && (
          <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {change >= 0 ? '+' : ''}{change}% vs mois dernier
          </p>
        )}
      </div>
      <div className={`p-4 rounded-xl bg-${color}-50 shrink-0`}>
        <Icon size={28} className={`text-${color}-600`} />
      </div>
    </div>
  </div>
);

interface BienCardProps {
  bien: Bien;
  onEdit: (bien: Bien) => void;
  onDelete: (bien: Bien) => void;
  onView: (bien: Bien) => void;
}

const BienCard: React.FC<BienCardProps> = ({ bien, onEdit, onDelete, onView }) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'DISPONIBLE': return 'bg-green-100 text-green-800';
      case 'RESERVE': return 'bg-orange-100 text-orange-800';
      case 'VENDU': return 'bg-gray-100 text-gray-800';
      case 'EN_NEGOCIATION': return 'bg-blue-100 text-blue-800';
      case 'EN_LOCATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'DISPONIBLE': return <CheckCircle size={14} />;
      case 'RESERVE': return <Clock size={14} />;
      case 'VENDU': return <CheckCircle size={14} />;
      case 'EN_NEGOCIATION': return <AlertCircle size={14} />;
      case 'EN_LOCATION': return <Calendar size={14} />;
      default: return <Clock size={14} />;
    }
  };

  // Calculs réalistes basés sur les vraies données
  const offresEnAttente = bien.offres.filter(o => o.statut === 'EN_ATTENTE').length;
  const visitesAPlanifier = bien.visites.filter(v => v.statut === 'DEMANDEE').length;
  const noteGlobale = bien.avis.length > 0 
    ? (bien.avis.reduce((sum, a) => sum + a.note, 0) / bien.avis.length).toFixed(1)
    : '—';
 
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <Image 
          src={bien.images[0]?.url || '/placeholder-property.jpg'} 
          alt={bien.nom}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(bien.statut)}`}>
            {getStatusIcon(bien.statut)}
            {bien.statut.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <button
              onClick={() => onView(bien)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} className="text-gray-600" />
            </button>
            <div className="relative group/menu">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 min-w-[140px] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                <button
                  onClick={() => onEdit(bien)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit size={14} />
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(bien)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
        {bien.images.length > 1 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Camera size={12} />
              +{bien.images.length - 1}
            </span>
          </div>
        )}
        {offresEnAttente > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {offresEnAttente} offre{offresEnAttente > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{bien.nom}</h3>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <MapPin size={14} />
              {bien.geolocalisation}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">
              {(bien.prix / 1000).toFixed(0)}k€
            </p>
            <p className="text-xs text-gray-500">{bien.surface}m²</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bien.description}</p>

        {visitesAPlanifier > 0 && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              {visitesAPlanifier} visite{visitesAPlanifier > 1 ? 's' : ''} à confirmer
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900">{bien.reservations.length}</p>
            <p className="text-xs text-gray-600">Réservations</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900">{bien.offres.length}</p>
            <p className="text-xs text-gray-600">Offres</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span className="text-sm text-gray-600">{bien.favoris}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              <span className="text-sm text-gray-600">{noteGlobale}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{bien.avis.length}</span>
            </div>
          </div>
          {bien.visiteVirtuelle && (
            <button className="text-indigo-600 text-sm hover:text-indigo-800 transition-colors">
              Visite 360°
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function VendeurDashboard() {
  const [biens, setBiens] = useState(mockBiens);
  const [filteredBiens, setFilteredBiens] = useState(mockBiens);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showAnalytics, setShowAnalytics] = useState(true);

  const categories = ['VILLA', 'MAISON', 'APPARTEMENT', 'HOTEL', 'TERRAIN', 'CHANTIER'];
  const statuts = ['DISPONIBLE', 'RESERVE', 'VENDU', 'EN_LOCATION', 'EN_NEGOCIATION'];

  // Calcul des statistiques RÉALISTES
  const stats = {
    totalBiens: biens.length,
    
    // Revenus depuis les offres acceptées
    totalRevenue: biens.reduce((sum, bien) => {
      const revenus = bien.offres
        .filter(o => o.statut === 'ACCEPTEE')
        .reduce((s, o) => s + o.montant, 0);
      return sum + revenus;
    }, 0),
    
    // Réservations confirmées uniquement
    totalReservations: biens.reduce((sum, bien) => 
      sum + bien.reservations.filter(r => r.statut === 'CONFIRMEE').length, 0
    ),
    
    totalOffres: biens.reduce((sum, bien) => sum + bien.offres.length, 0),
    
    // Offres en attente (ACTION REQUISE)
    offresEnAttente: biens.reduce((sum, bien) => 
      sum + bien.offres.filter(o => o.statut === 'EN_ATTENTE').length, 0
    ),
    
    // Taux de conversion
    tauxConversion: (() => {
      const total = biens.reduce((s, b) => s + b.offres.length, 0);
      const acceptees = biens.reduce((s, b) => 
        s + b.offres.filter(o => o.statut === 'ACCEPTEE').length, 0
      );
      return total > 0 ? ((acceptees / total) * 100).toFixed(1) : 0;
    })(),
    
    // Note globale moyenne
    noteGlobale: (() => {
      const allAvis = biens.flatMap(b => b.avis);
      if (allAvis.length === 0) return 0;
      return (allAvis.reduce((s, a) => s + a.note, 0) / allAvis.length).toFixed(1);
    })(),
    
    // Visites à planifier (ACTION REQUISE)
    visitesAPlanifier: biens.reduce((sum, bien) => 
      sum + bien.visites.filter(v => v.statut === 'DEMANDEE').length, 0
    ),

    // Total favoris
    totalFavoris: biens.reduce((sum, bien) => sum + bien.favoris, 0)
  };

  // Filtrage et tri
  useEffect(() => {
    let filtered = biens;

    if (searchTerm) {
      filtered = filtered.filter(bien =>
        bien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.geolocalisation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategorie) {
      filtered = filtered.filter(bien => bien.categorie === selectedCategorie);
    }

    if (selectedStatut) {
      filtered = filtered.filter(bien => bien.statut === selectedStatut);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'prix-asc':
          return a.prix - b.prix;
        case 'prix-desc':
          return b.prix - a.prix;
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'ancien':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'offres':
          return b.offres.length - a.offres.length;
        case 'popularite':
          return b.favoris - a.favoris;
        default:
          return 0;
      }
    });

    setFilteredBiens(filtered);
  }, [biens, searchTerm, selectedCategorie, selectedStatut, sortBy]);

  const handleView = (bien: Bien) => {
    console.log('Voir bien:', bien);
  };

  const handleEdit = (bien: Bien) => {
    console.log('Modifier bien:', bien);
  };

  const handleDelete = (bien: Bien) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      setBiens(biens.filter(b => b.id !== bien.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Vendeur</h1>
              <p className="text-gray-600 mt-1">Gérez vos propriétés et suivez vos performances</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                {(stats.offresEnAttente + stats.visitesAPlanifier) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {stats.offresEnAttente + stats.visitesAPlanifier}
                  </span>
                )}
              </button>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-md">
                <Plus size={20} />
                Ajouter un bien
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Home} 
            title="Total Biens" 
            value={stats.totalBiens} 
            change={12}
            color="blue"
          />
          <StatCard 
            icon={Target} 
            title="Taux de Conversion" 
            value={`${stats.tauxConversion}%`} 
            change={5}
            color="green"
            subtitle={`${biens.reduce((s, b) => s + b.offres.filter(o => o.statut === 'ACCEPTEE').length, 0)} offres acceptées`}
          />
          <StatCard 
            icon={AlertCircle} 
            title="Actions Requises" 
            value={stats.offresEnAttente + stats.visitesAPlanifier} 
            change={-8}
            color="red"
            subtitle={`${stats.offresEnAttente} offres + ${stats.visitesAPlanifier} visites`}
          />
          <StatCard 
            icon={Star} 
            title="Note Moyenne" 
            value={stats.noteGlobale || '—'} 
            change={3}
            color="yellow"
            subtitle={`${biens.flatMap(b => b.avis).length} avis reçus`}
          />
        </div>

        {/* Statistiques Secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Revenus Générés</p>
              <DollarSign size={18} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{(stats.totalRevenue / 1000).toFixed(0)}k€</p>
            <p className="text-xs text-gray-500 mt-1">Depuis les offres acceptées</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Réservations</p>
              <Calendar size={18} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            <p className="text-xs text-gray-500 mt-1">Confirmées uniquement</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Total Offres</p>
              <Package size={18} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOffres}</p>
            <p className="text-xs text-gray-500 mt-1">Toutes catégories</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Popularité</p>
              <Heart size={18} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalFavoris}</p>
            <p className="text-xs text-gray-500 mt-1">Favoris totaux</p>
          </div>
        </div>

        {/* Section Analytics */}
        {showAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Graphique Évolution des Offres */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Évolution des Offres</h3>
                  <p className="text-sm text-gray-500">Performance des 6 derniers mois</p>
                </div>
                <Activity size={24} className="text-indigo-600" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={evolutionOffresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="offres" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    name="Offres reçues"
                    dot={{ fill: '#6366f1', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="acceptees" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Offres acceptées"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique Répartition des Statuts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Répartition des Biens</h3>
                  <p className="text-sm text-gray-500">Par statut actuel</p>
                </div>
                <BarChart3 size={24} className="text-indigo-600" />
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={repartitionStatutsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {repartitionStatutsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {repartitionStatutsData.map((item, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                    <p className="text-xs font-medium text-gray-700">{item.name}</p>
                    <p className="text-sm font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions Urgentes */}
        {(stats.offresEnAttente > 0 || stats.visitesAPlanifier > 0) && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions Urgentes</h3>
                <div className="space-y-2">
                  {stats.offresEnAttente > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">{stats.offresEnAttente} offre{stats.offresEnAttente > 1 ? 's' : ''}</span> en attente de réponse
                    </div>
                  )}
                  {stats.visitesAPlanifier > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">{stats.visitesAPlanifier} visite{stats.visitesAPlanifier > 1 ? 's' : ''}</span> à confirmer
                    </div>
                  )}
                </div>
                <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Traiter maintenant
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}