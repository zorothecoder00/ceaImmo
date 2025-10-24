'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Home, DollarSign, Maximize, Users, Star, Heart, Eye, X } from 'lucide-react';
import { Statut, VisiteStatut, Categorie, OffreStatut } from '@prisma/client'
import toast from "react-hot-toast";

interface Visite {
  id: number;
  date: string;
  statut: VisiteStatut;
  userId: number;
  proprietaireId?: number; 
  proprieteId: number; 
}

interface Propriete {
  id: number;
  nom: string;
  description?: string;
  categorie: Categorie;
  prix: number;  
  surface: number;
  statut: Statut;
  nombreChambres: number;
  geolocalisation: string;
  images: { url: string; ordre: number }[];
  visiteVirtuelle?: string;
  proprietaire?: {
    nom: string;
    prenom: string;
  };
  avis: { note: number }[];
  _count: {
    avis: number;
  };
  createdAt: string;
}

interface OffreData {   
  montant: string;
  message: string;
  mode?: string;
}

interface Offre {
  proprieteId: number;
  montant: number;
  message?: string;
  statut: OffreStatut;
  mode?: string;
}

interface SearchFilters {
  search: string;
  categorie: Categorie | '';
  statut: Statut | '';
  minPrix: string;
  maxPrix: string;
  minSurface: string;
  maxSurface: string;
  minChambres: string;
  maxChambres: string;
  geolocalisation: string;
  avecVisiteVirtuelle: boolean;
  minNote: string;
  page: string;           // <-- changer '1' en string
  limit: string;          // <-- changer '10' en string
  sortField: string;      // <-- accepter n’importe quel champ
  sortOrder: 'asc' | 'desc';
}



const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: Categorie.VILLA, label: 'Villa' },
  { value: Categorie.MAISON, label: 'Maison' },
  { value: Categorie.APPARTEMENT, label: 'Appartement' },
  { value: Categorie.HOTEL, label: 'Hôtel' },
  { value: Categorie.TERRAIN, label: 'Terrain' },
  { value: Categorie.CHANTIER, label: 'Chantier' }
];

const STATUTS: { value: Statut; label: string; color: string }[] = [
  { value: Statut.DISPONIBLE, label: 'Disponible', color: 'text-green-600 bg-green-100' },
  { value: Statut.RESERVE, label: 'Réservé', color: 'text-orange-600 bg-orange-100' },
  { value: Statut.EN_NEGOCIATION, label: 'En négociation', color: 'text-blue-600 bg-blue-100' },
  { value: Statut.EN_LOCATION, label: 'En location', color: 'text-purple-600 bg-purple-100' }
];  

export default function RecherchesPage() {
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favoris, setFavoris] = useState<Set<number>>(new Set());
  const [showOffreModal, setShowOffreModal] = useState(false);
  const [selectedPropriete, setSelectedPropriete] = useState<Propriete | null>(null);
  const [offreData, setOffreData] = useState<OffreData>({ montant: '', message: '', mode: '' });
  const [mesOffres, setMesOffres] = useState<Offre[]>([]);

  // 🆕 Pour la modale de demande de visite
  const [showVisiteModal, setShowVisiteModal] = useState(false);
  const [mesVisites, setMesVisites] = useState<Visite[]>([]);
  const [visiteDate, setVisiteDate] = useState(''); // pour la date saisie par l’utilisateur
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    categorie: '',
    statut: '',
    minPrix: '',
    maxPrix: '',
    minSurface: '',
    maxSurface: '',
    minChambres: '',
    maxChambres: '',
    geolocalisation: '',
    avecVisiteVirtuelle: false,
    minNote: '',
    page: '1',
    limit: '10',
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  // ✅ REMPLACEMENT DE LA SIMULATION PAR UN VRAI FETCH
  useEffect(() => {
    const fetchProprietes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();  

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== false && value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });

        const res = await fetch(`/api/acheteur/mesRecherches?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des propriétés");

        setProprietes(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 });
      } catch (error) {
        console.error('Erreur fetch propriétés :', error);
        toast.error('Erreur lors du chargement des propriétés.');
      } finally {
        setLoading(false);
      }
    };

    fetchProprietes();
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavori = (proprieteId: number) => {
    setFavoris(prev => {
      const newFavoris = new Set(prev);
      if (newFavoris.has(proprieteId)) {
        newFavoris.delete(proprieteId);
      } else {
        newFavoris.add(proprieteId);
      }
      return newFavoris;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateAverageNote = (avis: { note: number }[]) => {
    if (avis.length === 0) return 0;
    const sum = avis.reduce((acc, curr) => acc + curr.note, 0);
    return Math.round((sum / avis.length) * 10) / 10;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categorie: '',
      statut: '',
      minPrix: '',
      maxPrix: '',
      minSurface: '',
      maxSurface: '',
      minChambres: '',
      maxChambres: '',
      geolocalisation: '',
      avecVisiteVirtuelle: false,
      minNote: '',
      page: '1',
      limit: '10',
      sortField: 'createdAt',
      sortOrder: 'desc',
    });
  };

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch('/api/acheteur/mesOffres');
        if (!res.ok) throw new Error('Erreur lors du chargement des offres');
        const data = await res.json();
        setMesOffres(data.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres :', error);
      }
    };

    fetchOffres();
  }, []);

  useEffect(() => {
    const fetchVisites = async () => {
      try {
        const res = await fetch('/api/acheteur/mesVisites');
        if (!res.ok) throw new Error('Erreur lors du chargement des visites');
        const data = await res.json();
        setMesVisites(data.data); // Le format correspond à ton API GET
      } catch (error) {
        console.error('Erreur lors de la récupération des visites :', error);
      }
    };

    fetchVisites();
  }, []);

  const openOffreModal = (propriete: Propriete) => {
    // Vérifier si l'utilisateur a déjà une offre pour cette propriété
    const offreExistante = mesOffres.find(o => o.proprieteId === propriete.id);

    if (offreExistante) {
      toast(`Vous avez déjà fait une offre pour cette propriété : ${formatPrice(offreExistante.montant)} (statut : ${offreExistante.statut})`, {
        icon: '💰'
      });

      // Pré-remplir le formulaire pour permettre modification
      setOffreData({
        montant: offreExistante.montant.toString(),
        message: offreExistante.message || '',
        mode: offreExistante.mode || 'CARTEBANCAIRE'
      });
    } else {
      // Nouvelle offre : pré-remplir avec le prix de la propriété
      setOffreData({
        montant: propriete.prix.toString(),
        message: '',
        mode: 'CARTEBANCAIRE'
      });
    }

    setSelectedPropriete(propriete);
    setShowOffreModal(true);
  };


  const closeOffreModal = () => {
    setShowOffreModal(false);
    setSelectedPropriete(null);
    setOffreData({
      montant: '',
      message: ''
    });
  };

  // 🔹 Ouvrir la modale de visite
  const openVisiteModal = (propriete: Propriete) => {
    const visiteExistante = mesVisites.find(v => v.proprieteId === propriete.id);

    if (visiteExistante) {
      toast.error(
        `Vous avez déjà demandé une visite pour cette propriété le ${new Date(
          visiteExistante.date
        ).toLocaleDateString('fr-FR')} (statut : ${visiteExistante.statut}).`
      );
      return;
    }


    setSelectedPropriete(propriete);
    setShowVisiteModal(true);
  };

  // 🔹 Fermer la modale
  const closeVisiteModal = () => {
    setShowVisiteModal(false);
    setSelectedPropriete(null);
    setVisiteDate('');
  };


  // 🔹 Soumission d'une OFFRE
  const handleOffreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPropriete) return;

    // Validation
    if (!offreData.montant || parseFloat(offreData.montant) <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      return;
    }

    try {
      const response = await fetch('/api/acheteur/mesOffres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proprieteId: selectedPropriete.id,
          montant: parseFloat(offreData.montant),
          message: offreData.message,
          mode: offreData.mode || 'CARTEBANCAIRE', // Valeur par défaut
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur serveur:', data);
        toast.error(data.error || 'Erreur lors de l’envoi de l’offre.');
        return;
      }

      toast.success(`Offre de ${formatPrice(parseFloat(offreData.montant))} envoyée pour "${selectedPropriete.nom}".`);
      closeOffreModal();
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’offre:', error);
      toast.error('Une erreur est survenue lors de l’envoi de l’offre.');
    }

  };

  // 🔹 Soumission d'une VISITE
  const handleVisiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPropriete) return;
    if (!visiteDate) {
      toast.error('Veuillez choisir une date de visite.');
      return;
    }

    try {
      const response = await fetch('/api/acheteur/mesVisites', {
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proprieteId: selectedPropriete.id,
          date: visiteDate, // en format ISO string
        }),
      });  

      const data = await response.json();
  
      if (!response.ok) {
        console.error('Erreur serveur:', data);
        toast.error(data.error || 'Erreur lors de la demande de visite.');
        return;
      }

      toast.success(`Demande de visite envoyée pour "${selectedPropriete.nom}" le ${new Date(visiteDate).toLocaleDateString('fr-FR')}.`);
      closeVisiteModal();
    } catch (error) {
      console.error('Erreur lors de la demande de visite:', error);
      toast.error('Une erreur est survenue lors de la demande de visite.');
    }

  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: String(newPage) }));
  };

  const handleSortChange = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recherche de Propriétés
          </h1>
          
          {/* Barre de recherche principale */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, description, localisation..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filtres {showFilters ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                >
                  <option value="">Toutes catégories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.statut}
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                >
                  <option value="">Tous statuts</option>
                  {STATUTS.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (FCFA)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minPrix}
                    onChange={(e) => handleFilterChange('minPrix', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxPrix}
                    onChange={(e) => handleFilterChange('maxPrix', e.target.value)}
                  />
                </div>
              </div>

              {/* Surface */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surface (m²)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minSurface}
                    onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxSurface }
                    onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                  />
                </div>
              </div>

              {/* Chambres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chambres
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minChambres}
                    onChange={(e) => handleFilterChange('minChambres', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxChambres}
                    onChange={(e) => handleFilterChange('maxChambres', e.target.value)}
                  />
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville, quartier..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.geolocalisation}
                  onChange={(e) => handleFilterChange('geolocalisation', e.target.value)}
                />
              </div>

              {/* Note minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note minimum
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.minNote}
                  onChange={(e) => handleFilterChange('minNote', e.target.value)}
                >
                  <option value="">Toutes notes</option>
                  <option value="4">4+ étoiles</option>
                  <option value="3">3+ étoiles</option>
                  <option value="2">2+ étoiles</option>
                  <option value="1">1+ étoiles</option>
                </select>
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.avecVisiteVirtuelle}
                  onChange={(e) => handleFilterChange('avecVisiteVirtuelle', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">Avec visite virtuelle</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Effacer les filtres
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {proprietes.length} propriété{proprietes.length > 1 ? 's' : ''} trouvée{proprietes.length > 1 ? 's' : ''}
              </p>
              <select className="p-2 border border-gray-300 rounded-md">
                <option>Trier par: Plus récent</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Surface croissante</option>
                <option>Surface décroissante</option>
                <option>Mieux notées</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proprietes.map((propriete) => (
                <div key={propriete.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {propriete.images.length > 0 ? (
                      <img
                        src={propriete.images[0].url}
                        alt={propriete.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        STATUTS.find(s => s.value === propriete.statut)?.color || 'text-gray-600 bg-gray-100'
                      }`}>
                        {STATUTS.find(s => s.value === propriete.statut)?.label || propriete.statut}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => toggleFavori(propriete.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favoris.has(propriete.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </button>
                      {propriete.visiteVirtuelle && (
                        <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </button>
                      )}
                    </div>

                    {/* Prix */}
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-bold">
                        {formatPrice(propriete.prix)}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {propriete.nom}
                      </h3>  
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {propriete.categorie}
                      </span>
                    </div>

                    {propriete.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {propriete.description}
                      </p>
                    )}

                    {/* Caractéristiques */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <span>{propriete.surface} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{propriete.nombreChambres} ch.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{propriete.geolocalisation}</span>
                      </div>
                    </div>

                    {/* Note et propriétaire */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {calculateAverageNote(propriete.avis) || 'Pas de note'}
                          {propriete.avis.length > 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({propriete.avis.length})
                            </span>
                          )}
                        </span>
                      </div>
                      {propriete.proprietaire && (
                        <span className="text-xs text-gray-500">
                          {propriete.proprietaire.prenom} {propriete.proprietaire.nom}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm">
                      Voir détails
                    </button>
                    <button
                      onClick={() => openOffreModal(propriete)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 text-sm"
                    >
                      Faire une offre
                    </button>
                    <button
                      onClick={() => openVisiteModal(propriete)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Demander une visite
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <nav className="flex space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Précédent
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Suivant
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Modale Faire une Offre */}
      {showOffreModal && selectedPropriete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeOffreModal}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Faire une offre
                </h2>
                <button
                  onClick={closeOffreModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleOffreSubmit} className="p-6">
                {/* Informations de la propriété */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {selectedPropriete.images.length > 0 ? (
                        <img
                          src={selectedPropriete.images[0].url}
                          alt={selectedPropriete.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {selectedPropriete.nom}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedPropriete.categorie} • {selectedPropriete.surface} m² • {selectedPropriete.nombreChambres} chambres
                      </p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedPropriete.geolocalisation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Montant de l'offre */}
                <div className="mb-5">
                  <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant de l’offre (€)
                  </label>
                  <input
                    type="number"
                    id="montant"
                    name="montant"
                    value={offreData.montant}
                    onChange={(e) => setOffreData({ ...offreData, montant: e.target.value })}
                    required
                    min={1000}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 120000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Le prix initial est de {selectedPropriete.prix.toLocaleString()} €</p>
                </div>

                {/* Message optionnel */}
                <div className="mb-5">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message à l’agent (optionnel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={offreData.message}
                    onChange={(e) => setOffreData({ ...offreData, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Je suis vraiment intéressé par cette propriété..."
                  ></textarea>
                </div>

                {/* Mode de paiement (optionnel pour acompte) */}
                <div className="mb-6">
                  <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                    Mode de paiement (optionnel)
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    value={offreData.mode || ''}
                    onChange={(e) => setOffreData({ ...offreData, mode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un mode</option>
                    <option value="MIXXBYYAS">MixxByYas</option>
                    <option value="MOOV">Moov</option>
                    <option value="CARTEBANCAIRE">Carte bancaire</option>
                    <option value="WESTERNUNION">Western Union</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>

                {/* Boutons d’action */}
                <div className="flex justify-end gap-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={closeOffreModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Envoyer l’offre
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Modale Demande de Visite */}
      {showVisiteModal && selectedPropriete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Demande de visite pour {selectedPropriete.nom}</h2>
            <form onSubmit={handleVisiteSubmit}>
              <label className="block mb-3">
                <span className="text-gray-700">Date souhaitée :</span>
                <input
                  type="datetime-local"
                  value={visiteDate}
                  onChange={(e) => setVisiteDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                />
              </label>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeVisiteModal} className="px-4 py-2 border rounded-lg">
                  Annuler
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>  
  );
}