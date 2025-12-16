'use client'

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Home, Bed, Eye, Grid, List, ArrowUpDown } from 'lucide-react';
import Link from "next/link"; // 👈 ajoute cet import
import { Categorie } from '@prisma/client'

interface Propriete {    
  id: number   
  nom: string
  prix: number
  geolocalisation: string
  surface: number
  nombreChambres: number
  images: { url: string }[]
  visiteVirtuelle?: string | null
  categorie: Categorie
  nouveau?: boolean
}

// 2. Props du composant PropertyCard
interface PropertyCardProps {
  propriete: Propriete
}

const ProprietesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'prix_asc' | 'prix_desc' | 'surface_asc' | 'surface_desc'>('recent');
  const [showFilters, setShowFilters] = useState(true);
  const [categorie, setCategorie] = useState<Categorie | ''>(''); // ✅ ajouté
  const [localisation, setLocalisation] = useState(''); // ✅ ajouté
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [surfaceMin, setSurfaceMin] = useState('');
  const [surfaceMax, setSurfaceMax] = useState('');
  const [chambresMin, setChambresMin] = useState('');
  const [chambresMax, setChambresMax] = useState('');
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  
  // ✅ Définition de la fonction en dehors du useEffect
  const fetchProprietes = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        take: itemsPerPage.toString(),
        skip: ((currentPage - 1) * itemsPerPage).toString(),
        orderBy: sortBy === 'recent' ? 'createdAt' : sortBy.includes('prix') ? 'prix' : 'surface',
        order: sortBy.endsWith('asc') ? 'asc' : 'desc',
        categorie: categorie || '',
        geolocalisation: localisation || '',
        prixMin: prixMin?.toString() || '',
        prixMax: prixMax?.toString() || '',
        surfaceMin: surfaceMin?.toString() || '',
        surfaceMax: surfaceMax?.toString() || '',
        chambresMin: chambresMin || '',
        chambresMax: chambresMax || '',
      });

      const res = await fetch(`/api/proprietes?${queryParams}`);
      const data = await res.json();
      setProprietes(data.data ?? []);
      setTotalPages(Math.ceil((data.total ?? 0) / itemsPerPage));
    } catch (error) {
      console.error("Erreur lors du fetch des propriétés :", error);
      setProprietes([]);
      setTotalPages(1);
    }
  }, [
    currentPage,
    sortBy,
    categorie,
    localisation,
    prixMin,
    prixMax,
    surfaceMin,
    surfaceMax,
    chambresMin,
    chambresMax,
  ]);

  // ✅ Appel automatique au montage ou quand les dépendances changent
  useEffect(() => {
    fetchProprietes();
  }, [fetchProprietes]);

  // ✅ Fonction pour réinitialiser les filtres
  const resetProprietes = () => {
    setCategorie('');
    setLocalisation('');
    setPrixMin('');
    setPrixMax('');
    setSurfaceMin('');
    setSurfaceMax('');
    setChambresMin('');
    setChambresMax('');
    setCurrentPage(1);
    fetchProprietes();
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString('fr-FR') + ' €';
  };

  const PropertyCard = ({ propriete }: PropertyCardProps) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Home className="w-16 h-16 text-blue-500" />
        </div>
        {propriete.nouveau && (
          <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Nouveau
          </span>
        )}
        {propriete.visiteVirtuelle && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
        )}
      </div>
        
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {propriete.nom}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm">{propriete.geolocalisation}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(propriete.prix)}
          </div>
          <div className="text-sm text-gray-500">
            {propriete.surface} m²
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {propriete.nombreChambres} ch.
          </div>
          
        </div>
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          Voir les détails
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Accueil
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Nos Propriétés</h1>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par ville, quartier, code postal..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filtres latéraux */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filtres</h2>
              
              {/* Type de bien */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                   onChange={(e) => setCategorie(e.target.value as Categorie)} // ← si tu veux filtrer
                >
                  <option value="">Tous les types</option>
                  {Object.values(Categorie).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Localisation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Entrez une ville, un quartier ou un code postal..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setLocalisation(e.target.value)} // ← pour gérer la recherche
                />              
              </div>

              {/* Prix min / max */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix min</label>
                  <input
                    type="number"
                    value={prixMin}
                    onChange={(e) => setPrixMin(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix max</label>
                  <input
                    type="number"
                    value={prixMax}
                    onChange={(e) => setPrixMax(e.target.value)}
                    placeholder="5000000"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Surface min / max */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surface min (m²)</label>
                  <input
                    type="number"
                    value={surfaceMin}
                    onChange={(e) => setSurfaceMin(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surface max (m²)</label>
                  <input
                    type="number"
                    value={surfaceMax}
                    onChange={(e) => setSurfaceMax(e.target.value)}
                    placeholder="500"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Chambres min / max */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chambres min</label>
                  <input
                    type="number"
                    value={chambresMin}
                    onChange={(e) => setChambresMin(e.target.value)}
                    placeholder="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chambres max</label>
                  <input
                    type="number"
                    value={chambresMax}
                    onChange={(e) => setChambresMax(e.target.value)}
                    placeholder="10"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Prix */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Prix min"
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Prix max"
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Surface */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (m²)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Visite virtuelle</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Nouveautés</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Avec jardin</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={fetchProprietes}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Appliquer les filtres
              </button>

              <button
                onClick={resetProprietes}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Réinitialiser les filtres
              </button>

            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'outils */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-gray-600 text-sm sm:text-base">
                  <span className="font-medium">{proprietes?.length ?? 0}</span> biens trouvés
                </div>
                
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  {/* Tri */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select 
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setSortBy(e.target.value as 'recent' | 'prix_asc' | 'prix_desc' | 'surface_asc' | 'surface_desc')
                      }
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="recent">Plus récents</option>
                      <option value="prix_asc">Prix croissant</option>
                      <option value="prix_desc">Prix décroissant</option>
                      <option value="surface_asc">Surface croissante</option>
                      <option value="surface_desc">Surface décroissante</option>
                    </select>
                  </div>
                  
                  {/* Mode d'affichage */}
                  <div className="flex border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grille des propriétés */}
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            }`}>
              {proprietes?.length
                ? proprietes
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((propriete) => (
                      <PropertyCard key={propriete.id} propriete={propriete} />
                    ))
                : <div className="col-span-full text-center text-gray-500">Aucune propriété trouvée</div>
              }
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>  
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProprietesPage;