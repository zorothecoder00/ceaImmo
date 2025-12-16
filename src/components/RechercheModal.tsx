'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, Filter, MapPin, Home, DollarSign, Maximize2, Bed, Star } from 'lucide-react';
import { Categorie, Statut } from '@prisma/client'
import Image from 'next/image'
import toast from "react-hot-toast";

interface Geolocalisation {
  latitude: number
  longitude: number
}

interface ResultatPropriete {
  id: string;  
  nom: string;
  categorie: Categorie;
  statut: Statut;
  prix: number;
  surface?: number | null;
  nombreChambres?: number | null;
  geolocalisation?: Geolocalisation | null;
  images?: { url: string }[];
}

interface Filters {
  search: string;
  categorie: string;
  statut: string;
  minPrix: string;
  maxPrix: string;
  minSurface: string;
  maxSurface: string;
  latitude: number | null;    // <-- ici
  longitude: number | null;   // <-- ici
  radius: string;
  minChambres: string;
  maxChambres: string;
  minNote: string;
  sortField: string;
  sortOrder: string;
  page: number;
  limit: number;
}

interface Meta {
  totalApresFiltre: number;
  total: number;
  page: number;
  limit: number;
}


const CATEGORIES = Object.values(Categorie);
const STATUTS = Object.values(Statut);

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [address, setAddress] = useState('')

  const [results, setResults] = useState<ResultatPropriete[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Filtres de recherche
  const [filters, setFilters] = useState<Filters>({
  search: '',
  categorie: '',
  statut: '',
  minPrix: '',
  maxPrix: '',
  minSurface: '',
  maxSurface: '',
  latitude: null,
  longitude: null,
  radius: '5000',
  minChambres: '',
  maxChambres: '',
  minNote: '',
  sortField: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
});

  useEffect(() => {
    if (!isOpen) {
      setResults([]);
      setMeta(null);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Construire les query params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
   
      const res = await fetch(`/api/acheteur/mesRecherches?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur de recherche');

      const data = await res.json();
      setResults(data.data || []);
      setMeta(data.meta || null);
    } catch (err) {
      console.error('Erreur recherche:', err);
      alert('Erreur lors de la recherche.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // On scrolle vers la div des résultats, qu'il y ait ou non des résultats
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [results]);


  const handleReset = () => {
    setFilters({
      search: '',
      categorie: '',
      statut: '',
      minPrix: '',
      maxPrix: '',
      minSurface: '',
      maxSurface: '',
      latitude: null,
      longitude: null,
      radius: '5000',
      minChambres: '',
      maxChambres: '',
      minNote: '',
      sortField: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
    setAddress('');
    setResults([]);
    setMeta(null);
  };

  const handleGeocode = async () => {
    if (!address.trim()) {
      toast.error("Veuillez entrer une adresse.");
      return;
    }
    setIsGeocoding(true);

    // 1️⃣ - Vérifier si l’input est déjà un format "lat, lon"
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const directMatch = address.trim().match(coordRegex);

    if (directMatch) {
      const lat = parseFloat(directMatch[1]);
      const lon = parseFloat(directMatch[3]);

      setFilters({ ...filters, latitude: lat, longitude: lon });
      toast.success("📍 Coordonnées détectées et appliquées !");
      setIsGeocoding(false);
      return;
    }

    // 2️⃣ - Vérifier si c’est un lien Google Maps avec coordonnées
    const googleRegex = /@(-?\d+\.\d+),(-?\d+\.\d+),/;
    const urlMatch = address.match(googleRegex);

    if (urlMatch) {
      const lat = parseFloat(urlMatch[1]);
      const lon = parseFloat(urlMatch[2]);

      setFilters({ ...filters, latitude: lat, longitude: lon });
      toast.success("📍 Coordonnées extraites du lien Google Maps !");
      setIsGeocoding(false);
      return;
    }
  
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(address)}&size=1`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_ORS_API_KEY as string,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Erreur OpenRouteService");

      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        toast.error("❌ Aucune localisation trouvée.");
        setIsGeocoding(false);
        return;
      }

      // ORS retourne [longitude, latitude]
      const [lon, lat] = data.features[0].geometry.coordinates;
      setFilters({ ...filters, latitude: lat, longitude: lon });
      toast.success("📍 Adresse géocodée avec succès !");
    } catch (error) {
      console.error("Erreur ORS:", error);
      toast.error("❌ Erreur lors du géocodage.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6 hover:bg-green-700 transition inline-flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        + Nouvelle recherche
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recherche Avancée</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Adresse / Géolocalisation */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" /> Localisation
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Lomé, Agoè"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleGeocode}
                  disabled={isGeocoding}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isGeocoding ? '📍...' : '📍 Localiser'}
                </button>
              </div>
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rayon (m)
              </label>
              <input
                type="number"
                value={filters.radius}
                onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
                placeholder="5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Recherche texte */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Recherche (mot-clé)
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Ex: villa, piscine, Adidogomé"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 inline mr-1" /> Catégorie
              </label>
              <select
                value={filters.categorie}
                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                {STATUTS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Prix min/max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" /> Prix min
              </label>
              <input
                type="number"
                value={filters.minPrix}
                onChange={(e) => setFilters({ ...filters, minPrix: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix max
              </label>
              <input
                type="number"
                value={filters.maxPrix}
                onChange={(e) => setFilters({ ...filters, maxPrix: e.target.value })}
                placeholder="Illimité"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Maximize2 className="w-4 h-4 inline mr-1" /> Surface min (m²)
              </label>
              <input
                type="number"
                value={filters.minSurface}
                onChange={(e) => setFilters({ ...filters, minSurface: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface max (m²)
              </label>
              <input
                type="number"
                value={filters.maxSurface}
                onChange={(e) => setFilters({ ...filters, maxSurface: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="w-4 h-4 inline mr-1" /> Min chambres
              </label>
              <input
                type="number"
                value={filters.minChambres}
                onChange={(e) => setFilters({ ...filters, minChambres: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max chambres
              </label>
              <input
                type="number"
                value={filters.maxChambres}
                onChange={(e) => setFilters({ ...filters, maxChambres: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Note minimale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" /> Note minimale
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filters.minNote}
                onChange={(e) => setFilters({ ...filters, minNote: e.target.value })}
                placeholder="Ex: 4.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSearching ? 'Recherche en cours...' : 'Lancer la recherche'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Réinitialiser
            </button>
          </div>

          {/* Résultats */}
          {results.length > 0 && (
            <div ref={resultsRef} className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {meta?.totalApresFiltre || results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((p) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer bg-white"
                    onClick={() => (window.location.href = `/proprietes/${p.id}`)}
                  >
                    <div className=" flex gap-4">
                      {p.images?.[0] && (
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={p.images[0].url}
                            alt={p.nom}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate mb-1">{p.nom}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {p.categorie} • {p.statut.replace('_', ' ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">
                            {formatPrice(p.prix)}
                          </span>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Maximize2 className="w-4 h-4" />
                              {p.surface}m²
                            </span>
                            {(p.nombreChambres ?? 0) > 0 && (
                              <span className="flex items-center gap-1">
                                <Bed className="w-4 h-4" /> {p.nombreChambres}
                              </span>
                            )}
                          </div>
                        </div>
                        {p.geolocalisation && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <a
                              href={`https://www.google.com/maps?q=${p.geolocalisation.latitude},${p.geolocalisation.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-blue-600"
                            >
                              {p.geolocalisation.latitude.toFixed(6)}, {p.geolocalisation.longitude.toFixed(6)}
                            </a>
                          </p>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aucun résultat */}
          {!isSearching && results.length === 0 && (
            <div ref={resultsRef} className="text-center py-8 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucune propriété ne correspond à vos critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}