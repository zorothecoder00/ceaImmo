'use client'

import { useState, useEffect } from 'react'
import {
  Heart, MapPin, Bed, Bath, Square, Eye, Trash2, Filter, Send
} from 'lucide-react'
import { Statut, VisiteStatut, Categorie, OffreStatut } from '@prisma/client'
import toast from "react-hot-toast";

// 🧩 Types corrigés
interface ProprieteImage {
  url: string
  ordre: number   
}

interface Favori {
  id: number;
  userId: number;
  propriete: Property; // la vraie propriété est imbriquée ici
}
  
interface Property {
  id: number;
  nom: string;
  description?: string;
  categorie: Categorie;
  prix: number;  
  surface: number;
  statut: Statut;
  nombreChambres: number;
  chambres?: string
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

interface OffreForm {
  montant: string
  message: string
}

interface Visite {
  proprieteId: number;
  date: string;
  statut: string;
}

interface Offre {
  proprieteId: number;
  montant: number;
  message?: string;
  statut: OffreStatut;
}

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [showOffreModal, setShowOffreModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [offreForm, setOffreForm] = useState<OffreForm>({
    montant: '',
    message: ''
  })
  // ✅ Gestion des visites et offres existantes
  const [mesVisites, setMesVisites] = useState<Visite[]>([])
  const [mesOffres, setMesOffres] = useState<Offre[]>([])

  // 🆕 Pour la modale de demande de visite
  const [showVisiteModal, setShowVisiteModal] = useState(false);
  const [visiteDate, setVisiteDate] = useState(''); // pour la date saisie par l’utilisateur
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10,
    sortField: 'createdAt',  
    sortOrder: 'desc',
  })

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: filters.page.toString(),
          limit: filters.limit.toString(),
          sortField: filters.sortField,
          sortOrder: filters.sortOrder,
        })

        const res = await fetch(`/api/acheteur/mesFavoris?${params.toString()}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "Erreur lors du chargement")

        // ici on extrait les propriétés de chaque favori
        const extracted = (data.data || []).map((f: Favori) => f.propriete)
        setFavorites(extracted)
      } catch (error) {
        console.error('Erreur fetch favoris :', error)
        toast.error('Erreur lors du chargement des propriétés.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [filters])

  useEffect(() => {
    let data = [...favorites]

    if (selectedFilter !== 'all') {
      data = data.filter((p) => p.categorie === selectedFilter)
    }

    if (sortBy === 'price-high') {
      data.sort((a, b) => b.prix - a.prix)
    } else if (sortBy === 'price-low') {
      data.sort((a, b) => a.prix - b.prix)
    } else if (sortBy === 'recent') {
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredFavorites(data)
  }, [favorites, selectedFilter, sortBy])



  // ------------------ SUPPRESSION FAVORI ------------------
  const removeFavorite = async (id: number) => {
    try {
      const res = await fetch(`/api/acheteur/mesFavoris/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur de suppression')
      setFavorites((prev) => prev.filter((p) => p.id !== id))
      toast.success("Propriété retirée des favoris.")
    } catch (err) {
      toast.error("Erreur lors de la suppression.")
    }
  }

  // 🔹 Ouvrir la modale de visite
  const openVisiteModal = (propriete: Property) => {
    const visiteExistante = mesVisites.find(v => v.proprieteId === propriete.id);

    if (visiteExistante) {
      toast.error(
        `Vous avez déjà demandé une visite pour cette propriété le ${new Date(
          visiteExistante.date
        ).toLocaleDateString('fr-FR')} (statut : ${visiteExistante.statut}).`
      );
      return;
    }

    setSelectedProperty(propriete);
    setShowVisiteModal(true);
  };

  // 🔹 Ouvrir la modale d'offre
  const openOffreModal = (propriete: Property) => {
    const offreExistante = mesOffres.find(o => o.proprieteId === propriete.id);

    if (offreExistante) {
      toast(`Vous avez déjà fait une offre pour cette propriété (statut : ${offreExistante.statut}).`, {
        icon: '💰'
      });

      // Pré-remplir le formulaire pour permettre modification
      setOffreForm({
        montant: offreExistante.montant.toString(),
        message: offreExistante.message || ''
      });
    } else {
      setOffreForm({ montant: '', message: '' });
    }

    setSelectedProperty(propriete);
    setShowOffreModal(true);
  };

  const closeModal = () => {
    setShowOffreModal(false)
    setSelectedProperty(null)
  }

  const closeVisiteModal = () => {
    setShowVisiteModal(false)
    setSelectedProperty(null)
  }

  // ------------------ OFFRES ------------------
  const handleFaireOffre = (property: Property) => {
    setSelectedProperty(property)
    setShowOffreModal(true)
  }

  const handleSubmitOffre = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProperty) return
    try {
      const res = await fetch('/api/acheteur/mesOffres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proprieteId: selectedProperty.id,
          montant: offreForm.montant,
          message: offreForm.message,
        }),
      })
      if (!res.ok) throw new Error('Erreur de soumission')
      toast.success("Offre envoyée avec succès 🎉")
      setShowOffreModal(false)
      setOffreForm({ montant: '', message: '' })
    } catch (err) {
      toast.error("Erreur lors de l’envoi de l’offre.")
    }
  }

  // ------------------ VISITES ------------------
  const handleDemandeVisite = (property: Property) => {
    setSelectedProperty(property)
    setShowVisiteModal(true)
  }

  const handleSubmitVisite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProperty || !visiteDate) {
      toast.error('Veuillez choisir une date.')
      return
    }

    try {
      const res = await fetch('/api/acheteur/mesVisites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proprieteId: selectedProperty.id,
          date: visiteDate,
        }),
      })
      if (!res.ok) throw new Error('Erreur visite')
      toast.success("Demande de visite envoyée 🗓️")
      setShowVisiteModal(false)
      setVisiteDate('')
      setSelectedProperty(null)
    } catch (err) {
      toast.error("Erreur lors de la demande de visite.")
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Propriétés Favorites
          </h1>
          <p className="text-gray-600">
            Gérez vos propriétés favorites et trouvez celle de vos rêves
          </p>
        </div>

        {/* STATS */}
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

        {/* FILTRES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="flex space-x-2">
                {['all', ...Object.values(Categorie)].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {type === 'all' ? 'Tous' : type}
                </button>
              ))}

              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Trier par:
              </span>
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

        {/* LISTE DES FAVORIS */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori trouvé
            </h3>
            <p className="text-gray-600">
              {selectedFilter === 'all'
                ? "Vous n'avez pas encore ajouté de propriétés à vos favoris."
                : `Aucune propriété de type "${selectedFilter}" dans vos favoris.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="relative h-48 bg-gray-300"
                  style={{
                    backgroundImage: `url(${property.images?.[0]?.url || '/placeholder.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {property.categorie}
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

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {property.nom}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.geolocalisation}
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {property.prix}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.nombreChambres}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.chambres}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.surface}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Ajouté le {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Voir détails</span>
                    </button>

                    <button
                      onClick={() => handleFaireOffre(property)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Offre</span>
                    </button>

                    {/* 🟠 Nouveau bouton : Demander une visite */}     
                    <button
                      onClick={() => handleDemandeVisite(property)}
                      className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Demander une visite</span>
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

      {/* MODAL D'OFFRE */}
      {showOffreModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Faire une offre
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                {selectedProperty.nom}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedProperty.geolocalisation}
              </div>
              <div className="text-lg font-bold text-blue-600">
                Prix demandé: {selectedProperty.prix}
              </div>
            </div>

            <form onSubmit={handleSubmitOffre} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="montant"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Montant de votre offre *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <input
                    type="number"
                    id="montant"
                    value={offreForm.montant}
                    onChange={(e) =>
                      setOffreForm({ ...offreForm, montant: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entrez votre montant"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message au vendeur (optionnel)
                </label>
                <textarea
                  id="message"
                  value={offreForm.message}
                  onChange={(e) =>
                    setOffreForm({ ...offreForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Ajoutez un message pour expliquer votre offre..."
                  maxLength={500}
                />
              </div>   

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer l&apos;offre</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 Modale Demande de Visite */}
      {showVisiteModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Demande de visite pour {selectedProperty.nom}</h2>
            <form onSubmit={handleSubmitVisite}>
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
  )
}
