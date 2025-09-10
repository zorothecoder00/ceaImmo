'use client'

import React, { useState } from 'react';
import { Search, Filter, MapPin, Home, Bed, Bath, Square, Eye, Grid, List, ArrowUpDown } from 'lucide-react';
import Link from "next/link"; // 👈 ajoute cet import

// 1. On définit le type d'une propriété
interface Propriete {
  id: number   
  titre: string
  prix: number
  localisation: string
  surface: number
  pieces: number
  chambres: number
  sallesBains: number
  image: string
  visiteVirtuelle: boolean
  type: string
  nouveau: boolean
}

// 2. On définit les props du composant PropertyCard
interface PropertyCardProps {
  propriete: Propriete
}

const ProprietesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(true);
  
  // Données d'exemple
  const proprietes = [
    {
      id: 1,
      titre: "Villa moderne avec piscine",
      prix: 850000,
      localisation: "Cannes, Alpes-Maritimes",
      surface: 180,
      pieces: 5,
      chambres: 4,
      sallesBains: 3,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: true,
      type: "Villa",
      nouveau: true
    },
    {
      id: 2,
      titre: "Appartement centre-ville lumineux",
      prix: 320000,
      localisation: "Nice, Alpes-Maritimes",
      surface: 75,
      pieces: 3,
      chambres: 2,
      sallesBains: 1,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: false,
      type: "Appartement",
      nouveau: false
    },
    {
      id: 3,
      titre: "Maison de charme avec jardin",
      prix: 485000,
      localisation: "Antibes, Alpes-Maritimes",
      surface: 120,
      pieces: 4,
      chambres: 3,
      sallesBains: 2,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: true,
      type: "Maison",
      nouveau: false
    },
    {
      id: 4,
      titre: "Penthouse vue mer exceptionnelle",
      prix: 1200000,
      localisation: "Monaco",
      surface: 140,
      pieces: 4,
      chambres: 3,
      sallesBains: 2,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: true,
      type: "Appartement",
      nouveau: true
    },
    {
      id: 5,
      titre: "Studio cozy proche plage",
      prix: 180000,
      localisation: "Juan-les-Pins, Alpes-Maritimes",
      surface: 35,
      pieces: 1,
      chambres: 1,
      sallesBains: 1,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: false,
      type: "Studio",
      nouveau: false
    },
    {
      id: 6,
      titre: "Château rénové avec domaine",
      prix: 2500000,
      localisation: "Grasse, Alpes-Maritimes",
      surface: 350,
      pieces: 8,
      chambres: 6,
      sallesBains: 4,
      image: "/api/placeholder/300/200",
      visiteVirtuelle: true,
      type: "Château",
      nouveau: false
    }
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(proprietes.length / itemsPerPage);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' €';
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
          {propriete.titre}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm">{propriete.localisation}</span>
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
            <Square className="w-4 h-4 mr-1" />
            {propriete.pieces} pièces
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {propriete.chambres} ch.
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {propriete.sallesBains} sdb
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
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Tous les types</option>
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Villa</option>
                  <option>Studio</option>
                  <option>Château</option>
                </select>
              </div>
              
              {/* Localisation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Toutes les villes</option>
                  <option>Nice</option>
                  <option>Cannes</option>
                  <option>Monaco</option>
                  <option>Antibes</option>
                  <option>Grasse</option>
                </select>
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
              
              {/* Nombre de pièces */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de pièces
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 text-center"
                    >
                      {num}+
                    </button>
                  ))}
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
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Appliquer les filtres
              </button>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'outils */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">
                  <span className="font-medium">{proprietes.length}</span> biens trouvés
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Tri */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="recent">Plus récents</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="surface-asc">Surface croissante</option>
                      <option value="surface-desc">Surface décroissante</option>
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
              {proprietes
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((propriete) => (
                  <PropertyCard key={propriete.id} propriete={propriete} />
                ))
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