'use client'

import React, { useState, useEffect } from 'react';
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
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button' 
import { Card } from '@/components/ui/card'
import { Statut, Categorie } from '@prisma/client'
import { toast } from 'react-hot-toast';
import UploadProprieteImage from "@/components/UploadProprieteImage";
import Image from 'next/image'

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
  vues?: number;
  favoris?: number;
  messages?: number;
}

interface PropertyCardProps {
  bien: Bien;
  onEdit: (bien: Bien) => void;
  onDelete: (id: number) => void;
  onView: (bien: Bien) => void;
  viewMode: "grid" | "list";
}

interface FormData {
  nom: string;
  description: string;
  categorie: Categorie;
  prix: string;
  surface: string;
  statut: Statut;
  geolocalisation: string;
  nombreChambres: string;
  visiteVirtuelle: string;
}

// === PropertyCard ===
const PropertyCard: React.FC<PropertyCardProps> = ({ bien, onEdit, onDelete, onView, viewMode }) => {
  const getStatusInfo = (statut: Statut) => {
    switch (statut) {
      case Statut.DISPONIBLE:
        return { color: "text-green-700 bg-green-100", icon: CheckCircle, label: "Disponible" };
      case Statut.RESERVE:
        return { color: "text-orange-700 bg-orange-100", icon: Clock, label: "Réservé" };
      case Statut.VENDU:
        return { color: "text-gray-700 bg-gray-100", icon: XCircle, label: "Vendu" };
      case Statut.EN_NEGOCIATION:
        return { color: "text-blue-700 bg-blue-100", icon: AlertCircle, label: "En négociation" };
      case Statut.EN_LOCATION:
        return { color: "text-purple-700 bg-purple-100", icon: Home, label: "En location" };
      default:
        return { color: "text-gray-700 bg-gray-100", icon: Clock, label: statut };
    }
  };

  const getCategoryIcon = (categorie: Categorie) => {
    switch (categorie) {
      case Categorie.VILLA:
        return Home;
      case Categorie.MAISON:
        return Home;
      case Categorie.APPARTEMENT:
        return Building;
      case Categorie.HOTEL:
        return Hotel;
      case Categorie.TERRAIN:
        return TreePine;
      case Categorie.CHANTIER:
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
            <Image 
              src={bien.images[0]?.url || '/villapiscine.webp'} 
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
                    onClick={() => onDelete(bien.id)}
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
        <Image 
          src={bien.images[0]?.url || '/villapiscine.webp'} 
          alt={bien.nom}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
  const [biens, setBiens] = useState<Bien[]>([]);

  const [selectedBien, setSelectedBien] = useState<Bien | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // 'grid' ou 'list'

  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState<FormData>({
    nom: '',
    description: '',   
    categorie: Categorie.VILLA,
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
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchBiens = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/vendeur/mesBiens');
        if (!res.ok) throw new Error('Erreur lors du chargement des biens');
        const data = await res.json();
        setBiens(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger vos biens");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBiens();
  }, []);

  // Filtrage des biens
  const filteredBiens = biens.filter(bien => {
    const matchSearch = bien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bien.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bien.geolocalisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !selectedCategorie || bien.categorie === selectedCategorie;
    const matchStatut = !selectedStatut || bien.statut === selectedStatut;
    
    return matchSearch && matchCategorie && matchStatut;
  });
  
  const handleView = async (bien: Bien) => {
    try{
      setIsLoading(true)
      const res = await fetch(`/api/vendeur/mesBiens/${bien.id}`)
      if (!res.ok) throw new Error("Impossible de charger les détails du bien");
      const data = await res.json()
      setSelectedBien(data.data)
      setIsViewModalOpen(true)
    }catch (error) {
    console.error("Erreur lors d chargement du bien", error);
    toast.error("Erreur lors du chargement des détails du bien");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (bien: Bien) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/vendeur/mesBiens/${bien.id}`);
      if (!res.ok) throw new Error("Impossible de charger le bien pour modification");
      const data = await res.json();

      const bienData = data.data;

      setForm({
        nom: bienData.nom,
        description: bienData.description,
        categorie: bienData.categorie,
        prix: bienData.prix.toString(),
        surface: bienData.surface.toString(),
        statut: bienData.statut,
        geolocalisation: bienData.geolocalisation,
        nombreChambres: bienData.nombreChambres.toString(),
        visiteVirtuelle: bienData.visiteVirtuelle || '',
      });
      setImages(bienData.images || []);
      setChambres(bienData.chambres || []);
      setCurrentStep(1);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement du bien à modifier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Supprimer cette propriété ?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/vendeur/mesBiens/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      setBiens(prev => prev.filter(b => b.id !== id));
      toast.success('Bien supprimé');
    } catch(error) {
      console.error('Erreur lors de la suppression', error)
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddNew = () => {
    setShowModal(true)
    setCurrentStep(1)
    setSelectedBien(null);  // ✅ Réinitialiser selectedBien
    setForm({
      nom: '',
      description: '',
      categorie: Categorie.VILLA,
      prix: '',
      surface: '',
      statut: Statut.DISPONIBLE,
      geolocalisation: '',
      nombreChambres: '1',
      visiteVirtuelle: '',
    })
    setImages([])
    setChambres([])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ Validation côté client
      if (!form.nom || !form.categorie || !form.prix || !form.surface || !form.geolocalisation) {
        toast.error('Veuillez remplir tous les champs requis');
        return;
      }

      if (images.length === 0) {
        toast.error('Veuillez ajouter au moins une image');
        return;
      }

      // ✅ Extraction des URLs depuis le state images (déjà uploadées via UploadThing)
      const imageUrls = images.map(img => img.url);

      const method = selectedBien ? 'PUT' : 'POST';
      const url = selectedBien
      ? `/api/vendeur/mesBiens/${selectedBien.id}`
      : '/api/vendeur/mesBiens';

      // ✅ Préparation des données au format JSON
      const payload = {
        ...form,
        nom: form.nom,
        description: form.description,
        categorie: form.categorie,
        prix: Number(form.prix),
        surface: Number(form.surface),
        statut: form.statut,
        geolocalisation: form.geolocalisation,
        nombreChambres: Number(form.nombreChambres),
        visiteVirtuelle: form.visiteVirtuelle || null,
        imageUrls, // ✅ Tableau de strings (URLs)
        chambres: chambres.map(ch => ({
          ...ch,
          nom: ch.nom,
          description: ch.description,
          prixParNuit: Number(ch.prixParNuit),
          capacite: Number(ch.capacite),
          disponible: ch.disponible,
        })),
      };

      // 📡 Envoi en JSON (pas en FormData)
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Erreur lors de l\'ajout du bien');
      }

      const result = await res.json();

      if (selectedBien) {
        // Mise à jour dans la liste
        setBiens(prev => prev.map(b => (b.id === result.data.id ? result.data : b)));
        toast.success('Bien modifié avec succès');
      } else {
        // Ajout
        setBiens(prev => [result.data, ...prev]);
        toast.success('Bien ajouté avec succès');
      }
      
      // ✅ Réinitialiser le formulaire
      setShowModal(false);
      setCurrentStep(1);
      setSelectedBien(null);
      setForm({
        nom: '',
        description: '',
        categorie: Categorie.VILLA,
        prix: '',
        surface: '',
        statut: Statut.DISPONIBLE,
        geolocalisation: '',
        nombreChambres: '1',
        visiteVirtuelle: '',
      });
      setImages([]);
      setChambres([]);

    } catch (error) {
      console.error("Erreur lors de la création", error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du bien.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        form.nom.trim() !== '' &&
        form.categorie &&
        form.prix.trim() !== '' &&
        form.surface.trim() !== '' &&
        form.geolocalisation.trim() !== ''
      );
    }
    if (currentStep === 2) {
      return images.length > 0;
    }
    return true;
  };

  // Récupération des valeurs des enums Prisma
  const categories = Object.values(Categorie);
  const statuts = Object.values(Statut);


  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
        </div>
      )}

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

      {/* ✅ CORRECTION: Modal de visualisation au bon endroit */}
      <AnimatePresence>
        {isViewModalOpen && selectedBien && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Détails de la propriété
                  </h2>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <Image
                    src={selectedBien.images[0]?.url || '/placeholder.jpg'}
                    alt={selectedBien.nom}                
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    
                  />

                  <div>
                    <h3 className="text-lg font-bold">{selectedBien.nom}</h3>
                    <p className="text-gray-600">{selectedBien.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Catégorie:</strong> {selectedBien.categorie}</p>
                      <p><strong>Statut:</strong> {selectedBien.statut}</p>
                      <p><strong>Surface:</strong> {selectedBien.surface} m²</p>
                      <p><strong>Prix:</strong> {selectedBien.prix} €</p>
                    </div>
                    <div>
                      <p><strong>Localisation:</strong> {selectedBien.geolocalisation}</p>
                      <p><strong>Nombre de chambres:</strong> {selectedBien.nombreChambres}</p>
                      <p><strong>Visite virtuelle:</strong> 
                        {selectedBien.visiteVirtuelle 
                          ? <a href={selectedBien.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline ml-1">Voir</a> 
                          : " -"}
                      </p>
                    </div>
                  </div>

                  {selectedBien.chambres && selectedBien.chambres.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Chambres :</h4>
                      {selectedBien.chambres.map((ch, i) => (
                        <div key={i} className="border rounded-lg p-3 mb-2">
                          <p><strong>Nom :</strong> {ch.nom}</p>
                          <p><strong>Description :</strong> {ch.description}</p>
                          <p><strong>Prix/nuit :</strong> {ch.prixParNuit} €</p>
                          <p><strong>Capacité :</strong> {ch.capacite}</p>
                          <p><strong>Disponible :</strong> {ch.disponible ? "Oui" : "Non"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    {/* Modal d'ajout/modification */}
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
                    <h2 className="text-2xl font-bold">
                      {selectedBien ? 'Modifier la propriété' : 'Ajouter une propriété'}
                    </h2>
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
                          value={form.nom}
                          onChange={(e) => setForm({...form, nom: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Villa Moderne Lomé"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          value={form.categorie}
                          onChange={(e) => setForm({...form, categorie: e.target.value as Categorie})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
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
                          value={form.prix}
                          onChange={(e) => setForm({...form, prix: e.target.value})}
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
                          value={form.surface}
                          onChange={(e) => setForm({...form, surface: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="350"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={form.statut}
                          onChange={(e) => setForm({...form, statut: e.target.value as Statut})}
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
                          value={form.nombreChambres}
                          onChange={(e) => setForm({...form, nombreChambres: e.target.value})}
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
                          value={form.geolocalisation}
                          onChange={(e) => setForm({...form, geolocalisation: e.target.value})}
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
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
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
                        value={form.visiteVirtuelle}
                        onChange={(e) => setForm({...form, visiteVirtuelle: e.target.value})}
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
                    <UploadProprieteImage images={images} setImages={setImages} />
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
                              <div className="col-span-2 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`disponible-${index}`}
                                  checked={chambre.disponible}
                                  onChange={(e) => updateChambre(index, 'disponible', e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor={`disponible-${index}`} className="text-sm text-gray-700">
                                  Disponible
                                </label>
                              </div>
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

                  <div className="flex gap-2 items-center">
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
                        className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            {selectedBien ? 'Mettre à jour' : 'Enregistrer'}
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