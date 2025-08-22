'use client'

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Square, 
  Bed, 
  Bath, 
  Car, 
  Wifi, 

  Heart,
  Phone,
  Calendar,
  Share2,
  Eye,
  Play,
  Star,
  User,
  Send,
  ArrowLeft,
  Home,
  Thermometer,
  Zap,
  Shield,
  TreePine
} from 'lucide-react';
import { FormEvent } from 'react'

const FichePropriete = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  // Données de la propriété
  const propriete = {
    id: 1,
    titre: "Villa moderne avec piscine et vue mer",
    prix: 850000,
    localisation: "Cannes, Alpes-Maritimes",
    surface: 180,
    pieces: 5,
    chambres: 4,
    sallesBains: 3,
    parking: 2,
    etat: "Excellent",
    anneeConstruction: 2019,
    dpe: "A",
    type: "Villa",
    description: "Magnifique villa contemporaine située dans un quartier résidentiel prisé de Cannes. Cette propriété d'exception offre des prestations haut de gamme avec une vue panoramique sur la mer Méditerranée. L'architecture moderne s'intègre parfaitement dans son environnement naturel.",
    caracteristiques: [
      "Piscine chauffée 12x6m",
      "Terrasse de 80m²",
      "Jardin paysager 500m²",
      "Garage double",
      "Cave à vin climatisée",
      "Système domotique",
      "Alarme et vidéosurveillance",
      "Climatisation réversible"
    ],
    equipements: [
      { icon: Wifi, nom: "Fibre optique" },
      { icon: Car, nom: "Garage 2 places" },
      { icon: Thermometer, nom: "Climatisation" },
      { icon: Shield, nom: "Sécurité 24h" },
      { icon: TreePine, nom: "Jardin paysager" },
      { icon: Zap, nom: "Domotique" }
    ],
    images: [
      { type: 'image', url: '/api/placeholder/800/600', titre: 'Vue extérieure' },
      { type: 'image', url: '/api/placeholder/800/600', titre: 'Salon principal' },
      { type: 'image', url: '/api/placeholder/800/600', titre: 'Cuisine équipée' },
      { type: 'image', url: '/api/placeholder/800/600', titre: 'Chambre principale' },
      { type: 'video', url: '/api/placeholder/800/600', titre: 'Visite vidéo' },
      { type: 'image', url: '/api/placeholder/800/600', titre: 'Piscine et terrasse' }
    ],
    vendeur: {
      nom: "Marie Dubois",
      agence: "Prestige Immobilier Cannes",
      photo: "/api/placeholder/60/60",
      telephone: "04 93 12 34 56",
      email: "marie.dubois@prestige-immo.fr"
    }
  };

  const commentaires = [
    {
      id: 1,
      nom: "Jean Martin",
      note: 5,
      date: "15 mars 2024",
      commentaire: "Propriété exceptionnelle ! La vue est à couper le souffle et les prestations sont de très haute qualité. L'agence a été très professionnelle.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      nom: "Sophie Laurent",
      note: 4,
      date: "8 mars 2024",
      commentaire: "Villa magnifique dans un quartier très calme. La piscine et le jardin sont parfaitement entretenus. Quelques petits détails à revoir mais globalement très satisfait.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      nom: "Pierre Durand",
      note: 5,
      date: "2 mars 2024",
      commentaire: "Un vrai coup de cœur ! Cette villa correspond exactement à ce que nous recherchions. L'emplacement est idéal et la maison est dans un état parfait.",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % propriete.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + propriete.images.length) % propriete.images.length);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' €';
  };

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < note ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleSubmitComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour soumettre le commentaire
    console.log('Nouveau commentaire:', { rating, comment: newComment });
    setNewComment('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux propriétés
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galerie photos/vidéos */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                {propriete.images[currentImage].type === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        {propriete.images[currentImage].titre}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600">
                        {propriete.images[currentImage].titre}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Boutons navigation */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
                
                {/* Bouton visite virtuelle */}
                <button 
                  onClick={() => setShowVirtualTour(true)}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Visite virtuelle 360°
                </button>
                
                {/* Compteur d'images */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImage + 1} / {propriete.images.length}
                </div>
              </div>
              
              {/* Miniatures */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {propriete.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                        currentImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {img.type === 'video' ? (
                          <Play className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Home className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description détaillée */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {propriete.description}
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {propriete.caracteristiques.map((carac, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {carac}
                  </div>
                ))}
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Équipements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propriete.equipements.map((equipement, index) => {
                  const Icon = equipement.icon;
                  return (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-gray-700 text-sm">{equipement.nom}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commentaires et avis */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
              
              {/* Formulaire d'ajout d'avis */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Laisser un avis</h3>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note
                    </label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i + 1)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre commentaire
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Partagez votre expérience..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Publier l&apos;avis
                  </button>
                </div>
              </div>
              
              {/* Liste des commentaires */}
              <div className="space-y-4">
                {commentaires.map((commentaire) => (
                  <div key={commentaire.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{commentaire.nom}</h4>
                          <span className="text-sm text-gray-500">{commentaire.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(commentaire.note)}
                        </div>
                        <p className="text-gray-700 text-sm">{commentaire.commentaire}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Résumé de la propriété */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{propriete.titre}</h1>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {formatPrice(propriete.prix)}
              </div>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                <span>{propriete.localisation}</span>
              </div>
              
              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Square className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{propriete.surface} m²</div>
                  <div className="text-sm text-gray-600">Surface</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{propriete.pieces}</div>
                  <div className="text-sm text-gray-600">Pièces</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{propriete.chambres}</div>
                  <div className="text-sm text-gray-600">Chambres</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">{propriete.sallesBains}</div>
                  <div className="text-sm text-gray-600">Salles de bains</div>
                </div>
              </div>
              
              {/* Informations techniques */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">État</span>
                  <span className="font-medium text-green-600">{propriete.etat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Année</span>
                  <span className="font-medium">{propriete.anneeConstruction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DPE</span>
                  <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Classe {propriete.dpe}
                  </span>
                </div>
              </div>
              
              {/* Carte intégrée */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Localisation</h3>
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Carte interactive</p>
                    <p className="text-sm text-gray-500">Cannes, Alpes-Maritimes</p>
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contacter le vendeur
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Réserver une visite
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isFavorite 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    Favoris
                  </button>
                  
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
            
            {/* Informations vendeur */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre contact</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{propriete.vendeur.nom}</div>
                  <div className="text-sm text-gray-600">{propriete.vendeur.agence}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {propriete.vendeur.telephone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal visite virtuelle */}
      {showVirtualTour && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-3/4 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Visite virtuelle 360°</h3>
              <button 
                onClick={() => setShowVirtualTour(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Visite virtuelle 360°</h4>
                <p className="text-gray-500">Interface de visite virtuelle interactive</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichePropriete;