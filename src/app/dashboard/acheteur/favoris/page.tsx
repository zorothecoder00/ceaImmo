'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Bed, Bath, Square, Eye, Trash2, Filter } from 'lucide-react'

// Données d'exemple des propriétés favorites
const mockFavorites = [     
  {
    id: 1,
    title: "Villa moderne avec piscine",
    location: "Cannes, France",
    price: "€850,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "250 m²",
    image: "/api/placeholder/400/250",
    dateAdded: "2024-01-15",
    type: "Villa"
  },
  {
    id: 2,
    title: "Appartement vue mer",
    location: "Nice, France",
    price: "€450,000",
    bedrooms: 2,
    bathrooms: 2,
    area: "85 m²",
    image: "/api/placeholder/400/250",
    dateAdded: "2024-01-10",
    type: "Appartement"
  },
  {
    id: 3,
    title: "Maison de campagne",
    location: "Provence, France",
    price: "€320,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "180 m²",
    image: "/api/placeholder/400/250",
    dateAdded: "2024-01-08",
    type: "Maison"
  },
  {
    id: 4,
    title: "Penthouse de luxe",
    location: "Monaco",
    price: "€2,200,000",
    bedrooms: 3,
    bathrooms: 3,
    area: "150 m²",
    image: "/api/placeholder/400/250",
    dateAdded: "2024-01-05",
    type: "Penthouse"
  }
]

export default function FavorisPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [filteredFavorites, setFilteredFavorites] = useState(mockFavorites)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Filtrer par type de propriété
  useEffect(() => {
    let filtered = favorites

    if (selectedFilter !== 'all') {
      filtered = favorites.filter(property => 
        property.type.toLowerCase() === selectedFilter.toLowerCase()
      )
    }

    // Trier les résultats
    if (sortBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    } else if (sortBy === 'price-high') {
      filtered = filtered.sort((a, b) => 
        parseInt(b.price.replace(/[€,]/g, '')) - parseInt(a.price.replace(/[€,]/g, ''))
      )
    } else if (sortBy === 'price-low') {
      filtered = filtered.sort((a, b) => 
        parseInt(a.price.replace(/[€,]/g, '')) - parseInt(b.price.replace(/[€,]/g, ''))
      )
    }

    setFilteredFavorites(filtered)
  }, [favorites, selectedFilter, sortBy])

  // Retirer des favoris
  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(property => property.id !== id))
  }

  const propertyTypes = ['all', 'villa', 'appartement', 'maison', 'penthouse']

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Propriétés Favorites
          </h1>
          <p className="text-gray-600">
            Gérez vos propriétés favorites et trouvez celle de vos rêves
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">
                {favorites.length}
              </span>
              <span className="text-gray-600">propriétés favorites</span>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour: aujourd&apos;hui
            </div>
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filtres par type */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="flex space-x-2">
                {propertyTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedFilter(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tri */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Plus récent</option>
                <option value="price-high">Prix décroissant</option>
                <option value="price-low">Prix croissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des favoris */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori trouvé
            </h3>
            <p className="text-gray-600">
              {selectedFilter === 'all' 
                ? "Vous n'avez pas encore ajouté de propriétés à vos favoris."
                : `Aucune propriété de type "${selectedFilter}" dans vos favoris.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {property.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeFavorite(property.id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors group"
                      title="Retirer des favoris"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {property.price}
                  </div>

                  {/* Caractéristiques */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.area}
                    </div>
                  </div>

                  {/* Date ajoutée */}
                  <div className="text-xs text-gray-500 mb-4">
                    Ajouté le {new Date(property.dateAdded).toLocaleDateString('fr-FR')}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Voir détails</span>
                    </button>
                    <button
                      onClick={() => removeFavorite(property.id)}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}