'use client'

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Star,
  Heart,
  MessageSquare,
  Camera,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';

interface Image {
  id: number;
  url: string;
  ordre: number;
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
  images: Image[];
  visiteVirtuelle: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    reservations: number;
    offres: number;
    favoris: number;
    avis: number;
  };
  averageRating: number;
  totalRevenue: number;
}

// Mock data basé sur le schéma Prisma
const mockBiens = [
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
    _count: {
      reservations: 12,
      offres: 8,
      favoris: 34,
      avis: 15
    },
    averageRating: 4.8,
    totalRevenue: 45000
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
    _count: {
      reservations: 6,
      offres: 15,
      favoris: 18,
      avis: 8
    },
    averageRating: 4.3,
    totalRevenue: 8500
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
    _count: {
      reservations: 0,
      offres: 3,
      favoris: 7,
      avis: 0
    },
    averageRating: 0,
    totalRevenue: 0
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
    _count: {
      reservations: 28,
      offres: 5,
      favoris: 42,
      avis: 31
    },
    averageRating: 4.6,
    totalRevenue: 125000
  }
];

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number | string;
  change?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color = "blue" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-sm mt-1 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={14} className="mr-1" />
            {change >= 0 ? '+' : ''}{change}% vs mois dernier
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        <Icon size={24} className={`text-${color}-600`} />
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img 
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900">{bien._count.reservations}</p>
            <p className="text-xs text-gray-600">Réservations</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-900">{bien._count.offres}</p>
            <p className="text-xs text-gray-600">Offres</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span className="text-sm text-gray-600">{bien._count.favoris}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              <span className="text-sm text-gray-600">{bien.averageRating || '—'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{bien._count.avis}</span>
            </div>
          </div>
          {bien.visiteVirtuelle && (
            <button className="text-indigo-600 text-sm hover:text-indigo-800 transition-colors">
              Visite 360°
            </button>
          )}
        </div>

        {bien.totalRevenue > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Revenus générés: {(bien.totalRevenue / 1000).toFixed(1)}k€
            </p>
          </div>
        )}
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

  const categories = ['VILLA', 'MAISON', 'APPARTEMENT', 'HOTEL', 'TERRAIN', 'CHANTIER'];
  const statuts = ['DISPONIBLE', 'RESERVE', 'VENDU', 'EN_LOCATION', 'EN_NEGOCIATION'];

  // Calcul des statistiques
  const stats = {
    totalBiens: biens.length,
    totalRevenue: biens.reduce((sum, bien) => sum + bien.totalRevenue, 0),
    totalReservations: biens.reduce((sum, bien) => sum + bien._count.reservations, 0),
    totalOffres: biens.reduce((sum, bien) => sum + bien._count.offres, 0),
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

    // Tri
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
        case 'revenus':
          return b.totalRevenue - a.totalRevenue;
        default:
          return 0;
      }
    });

    setFilteredBiens(filtered);
  }, [biens, searchTerm, selectedCategorie, selectedStatut, sortBy]);

  const handleView = (bien: Bien) => {
    console.log('Voir bien:', bien);
    // Navigation vers la page de détail
  };

  const handleEdit = (bien: Bien) => {
    console.log('Modifier bien:', bien);
    // Navigation vers la page d'édition
  };

  const handleDelete = (bien: Bien) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      setBiens(biens.filter(b => b.id !== bien.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Biens</h1>
              <p className="text-gray-600 mt-1">Gérez votre portefeuille immobilier</p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm">
              <Plus size={20} />
              Ajouter un bien
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Home} 
            title="Total Biens" 
            value={stats.totalBiens} 
            change={12}
            color="blue"
          />
          <StatCard 
            icon={DollarSign} 
            title="Revenus Totaux" 
            value={`${(stats.totalRevenue / 1000).toFixed(0)}k€`} 
            change={8}
            color="green"
          />
          <StatCard 
            icon={Calendar} 
            title="Réservations" 
            value={stats.totalReservations} 
            change={-3}
            color="orange"
          />
          <StatCard 
            icon={Users} 
            title="Offres Reçues" 
            value={stats.totalOffres} 
            change={15}
            color="purple"
          />
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un bien..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
              >
                <option value="">Tous statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut.replace('_', ' ')}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Plus récents</option>
                <option value="ancien">Plus anciens</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="revenus">Revenus élevés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredBiens.length} bien{filteredBiens.length > 1 ? 's' : ''} trouvé{filteredBiens.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 size={16} />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Grille des biens */}
        {filteredBiens.length === 0 ? (
          <div className="text-center py-12">
            <Home size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bien trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Ajouter votre premier bien
            </button>
          </div>
        ) : (  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBiens.map(bien => (
              <BienCard
                key={bien.id}
                bien={bien}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}