'use client'

import React, { useState } from 'react';
import {   
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin, 
  Bed,    
  Square, 
  Heart,
  MessageSquare,
  Camera,
  ExternalLink,
  Filter,
  Grid3X3,
  List,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Home,
  Building,
  Hotel,
  TreePine,
  HardHat,
  Image,
  Settings,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button' 
import { Card } from '@/components/ui/card'
import { Statut, Categorie } from '@prisma/client'
// === Types ===

interface Chambre { 
  nom: string; 
  description: string; 
  prixParNuit: string; 
  capacite: string; 
  disponible: boolean
  ; 
}

interface PropertyImage {
  id: number;
  file?: File;
  url: string;
  ordre: number;
}

interface Bien {
  id: number;
  nom: string;
  description: string;
  categorie: Categorie; // ✅
  prix: number;
  surface: number;
  statut: Statut
  chambres?: Chambre[];
  nombreChambres: number;
  geolocalisation: string;
  images: PropertyImage[];
  visiteVirtuelle: string | null;
  createdAt: string;
  updatedAt: string;
  vues: number;
  favoris: number;
  messages: number;
}

interface PropertyCardProps {
  bien: Bien;
  onEdit: (bien: Bien) => void;
  onDelete: (bien: Bien) => void;
  onView: (bien: Bien) => void;
  viewMode: "grid" | "list";
}

// Mock data des propriétés du vendeur
const mesBiens: Bien[] = [
  {
    id: 1,
    nom: "Villa Moderne Bord de Mer",
    description: "Superbe villa avec vue panoramique sur l'océan, piscine privée et jardin tropical. Idéale pour les vacances en famille ou la location saisonnière.",
    categorie: "VILLA",
    prix: 850000,
    surface: 320,
    statut: "DISPONIBLE",
    nombreChambres: 4,
    geolocalisation: "Lomé, Bord de Mer",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", ordre: 0 },
      { id: 2, url: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800", ordre: 1 },
      { id: 3, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", ordre: 2 }
    ],
    visiteVirtuelle: "https://matterport.com/villa-moderne",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-09-15T14:20:00Z",
    vues: 245,
    favoris: 34,
    messages: 12
  },
  {
    id: 2,
    nom: "Appartement Centre-Ville Premium",
    description: "Magnifique appartement de standing dans le quartier résidentiel le plus prisé. Proche de toutes commodités, transport et écoles.",
    categorie: "APPARTEMENT",
    prix: 120000,
    surface: 85,
    statut: "RESERVE",
    nombreChambres: 2,
    geolocalisation: "Lomé Centre",
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", ordre: 0 },
      { id: 5, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", ordre: 1 }
    ],
    visiteVirtuelle: null,
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-09-10T11:45:00Z",
    vues: 156,
    favoris: 18,
    messages: 8
  },
  {
    id: 3,
    nom: "Terrain Constructible Zone Commerciale",
    description: "Terrain de 2000m² parfaitement situé pour projet commercial ou résidentiel. Toutes commodités à proximité, accès facile.",
    categorie: "TERRAIN",
    prix: 180000,
    surface: 2000,
    statut: "EN_NEGOCIATION",
    nombreChambres: 0,
    geolocalisation: "Kpalimé",
    images: [
      { id: 6, url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", ordre: 0 }
    ],
    visiteVirtuelle: null,
    createdAt: "2024-03-05T14:20:00Z",
    updatedAt: "2024-09-12T16:30:00Z",
    vues: 89,
    favoris: 7,
    messages: 3
  },
  {
    id: 4,
    nom: "Maison Familiale avec Jardin",
    description: "Charmante maison familiale dans quartier calme. Grand jardin, garage double et terrasse couverte. Parfaite pour une famille.",
    categorie: "MAISON",
    prix: 200000,
    surface: 150,
    statut: "DISPONIBLE",
    nombreChambres: 3,
    geolocalisation: "Sokodé",
    images: [
      { id: 7, url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", ordre: 0 },
      { id: 8, url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800", ordre: 1 }
    ],
    visiteVirtuelle: "https://matterport.com/maison-familiale",
    createdAt: "2024-04-12T16:45:00Z",
    updatedAt: "2024-09-08T09:30:00Z",
    vues: 198,
    favoris: 25,
    messages: 15
  },
  {
    id: 5,
    nom: "Hôtel Boutique Centre Historique",
    description: "Petit hôtel de charme entièrement rénové. 12 chambres, restaurant gastronomique et bar. Clientèle haut de gamme établie.",
    categorie: "HOTEL",
    prix: 450000,
    surface: 800,
    statut: "VENDU",
    nombreChambres: 12,
    geolocalisation: "Kara",
    images: [
      { id: 9, url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", ordre: 0 },
      { id: 10, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", ordre: 1 }
    ],
    visiteVirtuelle: "https://matterport.com/hotel-boutique",
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-08-25T14:15:00Z",
    vues: 312,
    favoris: 42,
    messages: 28
  }
];

// === PropertyCard ===
const PropertyCard: React.FC<PropertyCardProps> = ({ bien, onEdit, onDelete, onView, viewMode }) => {
  const getStatusInfo = (statut: Bien["statut"]) => {
    switch (statut) {
      case "DISPONIBLE":
        return { color: "text-green-700 bg-green-100", icon: CheckCircle, label: "Disponible" };
      case "RESERVE":
        return { color: "text-orange-700 bg-orange-100", icon: Clock, label: "Réservé" };
      case "VENDU":
        return { color: "text-gray-700 bg-gray-100", icon: XCircle, label: "Vendu" };
      case "EN_NEGOCIATION":
        return { color: "text-blue-700 bg-blue-100", icon: AlertCircle, label: "En négociation" };
      case "EN_LOCATION":
        return { color: "text-purple-700 bg-purple-100", icon: Home, label: "En location" };
      default:
        return { color: "text-gray-700 bg-gray-100", icon: Clock, label: statut };
    }
  };

  const getCategoryIcon = (categorie: Bien["categorie"]) => {
    switch (categorie) {
      case "VILLA":
        return Home;
      case "MAISON":
        return Home;
      case "APPARTEMENT":
        return Building;
      case "HOTEL":
        return Hotel;
      case "TERRAIN":
        return TreePine;
      case "CHANTIER":
        return HardHat;
      default:
        return Home;
    }
  };

  const statusInfo = getStatusInfo(bien.statut);
  const CategoryIcon = getCategoryIcon(bien.categorie);

  const StatusIcon = statusInfo.icon;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="flex">
          <div className="w-48 h-32 flex-shrink-0">
            <img 
              src={bien.images[0]?.url || '/placeholder.jpg'} 
              alt={bien.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{bien.categorie}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                    <StatusIcon size={12} />
                    {statusInfo.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{bien.nom}</h3>
                <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                  <MapPin size={14} />
                  {bien.geolocalisation}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{bien.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Square size={14} />
                    {bien.surface}m²
                  </span>
                  {bien.nombreChambres > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed size={14} />
                      {bien.nombreChambres} chambres
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {bien.vues} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {bien.favoris} favoris
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {(bien.prix / 1000).toFixed(0)}k€
                  </p>
                  <p className="text-sm text-gray-500">
                    {(bien.prix / bien.surface).toFixed(0)}€/m²
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(bien)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(bien)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(bien)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img 
          src={bien.images[0]?.url || '/placeholder.jpg'} 
          alt={bien.nom}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
            <StatusIcon size={12} />
            {statusInfo.label}
          </span>
        </div>
        
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
              <MoreVertical size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {bien.images.length > 1 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <Camera size={12} />
              {bien.images.length} photos
            </span>
          </div>
        )}
        
        {bien.visiteVirtuelle && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <ExternalLink size={12} />
              360°
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <CategoryIcon size={14} />
          <span>{bien.categorie}</span>
          <span className="text-gray-300">•</span>
          <span>Ajouté le {new Date(bien.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-xl mb-2">{bien.nom}</h3>
        
        <p className="text-gray-600 text-sm flex items-center gap-1 mb-3">
          <MapPin size={14} />
          {bien.geolocalisation}
        </p>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bien.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Surface</p>
            <p className="font-semibold text-gray-900">{bien.surface}m²</p>
          </div>
          {bien.nombreChambres > 0 && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Chambres</p>
              <p className="font-semibold text-gray-900">{bien.nombreChambres}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {bien.vues}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {bien.favoris}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={14} />
              {bien.messages}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">{(bien.prix / 1000).toFixed(0)}k€</p>
            <p className="text-sm text-gray-500">{(bien.prix / bien.surface).toFixed(0)}€/m²</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(bien)}
              className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
            >
              Voir
            </button>
            <button
              onClick={() => onEdit(bien)}
              className="px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors text-sm font-medium"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MesBiens() {
  const [biens, setBiens] = useState<Bien[]>(mesBiens);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // 'grid' ou 'list'

  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
  nom: string;
  description: string;
  categorie: Categorie | ''; // 👈
  prix: string;
  surface: string;
  statut: Statut;
  geolocalisation: string;
  nombreChambres: string;
  visiteVirtuelle: string;
}>({
  nom: '',
  description: '',
  categorie: '',
  prix: '',
  surface: '',
  statut: Statut.DISPONIBLE,
  geolocalisation: '',
  nombreChambres: '1',
  visiteVirtuelle: ''
});

  const [images, setImages] = useState<PropertyImage[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrage des biens
  const filteredBiens = biens.filter(bien => {
    const matchSearch = bien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bien.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bien.geolocalisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !selectedCategorie || bien.categorie === selectedCategorie;
    const matchStatut = !selectedStatut || bien.statut === selectedStatut;
    
    return matchSearch && matchCategorie && matchStatut;
  });

  const handleView = (bien: Bien) => {
    console.log('Consulter bien:', bien);
    // Ici tu peux naviguer vers une page de détail
  };

  const handleEdit = (bien: Bien) => {
    console.log('Modifier bien:', bien);
    // Ici tu peux naviguer vers une page d'édition
  };

  const handleDelete = (bien: Bien) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer "${bien.nom}" ?`);
    if (confirmed) {
      setBiens(biens.filter(b => b.id !== bien.id));
    }
  };

  const handleAddNew = () => {
    setShowModal(true)
    setCurrentStep(1)
    setFormData({
      nom: '',
      description: '',
      categorie: '',
      prix: '',
      surface: '',
      statut: 'DISPONIBLE',
      geolocalisation: '',
      nombreChambres: '1',
      visiteVirtuelle: ''
    })
    setImages([])
    setChambres([])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: PropertyImage[] = Array.from(files).map((file, index) => ({
        id: Date.now() + index, // 👈 ajouté
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

  const updateChambre = <K extends keyof Chambre>(
    index: number,
    field: K,
    value: Chambre[K]
  ) => {
    const updated = [...chambres];
    updated[index][field] = value;
    setChambres(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulation d'upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newBien: Bien = {
      id: Date.now(),
      nom: formData.nom,
      description: formData.description,
      categorie: formData.categorie as Categorie, // 👈 cast
      prix: parseInt(formData.prix),
      surface: parseInt(formData.surface),
      statut: formData.statut as Statut,   // 👈 cast
      geolocalisation: formData.geolocalisation,
      chambres: chambres,
      nombreChambres: parseInt(formData.nombreChambres),
      images,
      visiteVirtuelle: formData.visiteVirtuelle || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vues: 0,
      favoris: 0,
      messages: 0
    };

    
    setBiens([...biens, newBien])
    setIsSubmitting(false)
    setShowModal(false)
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

  // Récupération des valeurs des enums Prisma
  const categories = Object.values(Categorie);
  const statuts = Object.values(Statut);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête personnelle */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mes Propriétés</h1>
                <p className="text-gray-600 mt-2">
                  Voici vos {biens.length} biens immobiliers. Gérez-les à votre rythme.
                </p>
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Plus size={20} />
                Ajouter un bien
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos biens..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
              >
                <option value="">Tous statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut.replace('_', ' ')}</option>
                ))}
              </select>
              
              {/* Boutons de vue */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors border-l border-gray-300 ${
                    viewMode === 'list' 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredBiens.length === biens.length 
              ? `${biens.length} bien${biens.length > 1 ? 's' : ''} au total`
              : `${filteredBiens.length} bien${filteredBiens.length > 1 ? 's' : ''} trouvé${filteredBiens.length > 1 ? 's' : ''} sur ${biens.length}`
            }
          </p>
        </div>

        {/* Liste des biens */}
        {filteredBiens.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategorie || selectedStatut 
                ? 'Aucun bien ne correspond à vos critères'
                : 'Vous n\'avez pas encore de biens'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategorie || selectedStatut 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier bien immobilier'
              }
            </p>
            <button 
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Ajouter un bien
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredBiens.map(bien => (
              <PropertyCard
                key={bien.id}
                bien={bien}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode={viewMode}
              />
            ))}
          </div>  
        )}
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
                          onChange={(e) => setFormData({...formData, categorie: e.target.value as Categorie,})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Sélectionner...</option>
                          {Object.values(Categorie).map(cat => (
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
                          onChange={(e) => setFormData({...formData, statut: e.target.value as Statut,})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          {Object.values(Statut).map(st => (
                            <option key={st} value={st}>{st.replace('_', ' ')}</option>
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
                              <img
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