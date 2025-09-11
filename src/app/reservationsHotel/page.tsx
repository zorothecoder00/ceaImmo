'use client'

import React, { useState } from 'react';
import {   
  MapPin, 
  Calendar,     
  Users, 
  Search,   
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils,
  Dumbbell,
  Waves,
  AirVent,
  Tv,
  User,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Lock,
  Eye
} from 'lucide-react';  
import Link from "next/link";

// 1. On définit le type des avis et galerie
interface Avis {
  nom: string
  note: number
  commentaire: string
  date: string
}

interface GalerieItem {
  url: string
  titre: string
}

interface Equipement {
  icon: React.ComponentType<{ className?: string }>
  nom: string
}

// 2. Le type principal pour un hôtel
interface Hotel {
  id: number
  nom: string
  localisation: string
  prix: number
  etoiles: number
  note: number
  nombreAvis: number
  disponible: boolean
  image: string
  description: string
  equipements: Equipement[]
  galerie: GalerieItem[]
  avis: Avis[]
}

const ReservationHotel = () => {
  const [currentStep, setCurrentStep] = useState('search'); // search, results, hotel, payment
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchParams, setSearchParams] = useState({
    localisation: '',
    dateArrivee: '',
    dateDepart: '',
    nombrePersonnes: 2
  });
  const [paymentData, setPaymentData] = useState({
    nom: '',
    email: '',
    telephone: '',
    carteNumero: '',
    carteExpiration: '',
    carteCvv: ''
  });

  // Données d'exemple des hôtels
  const hotels = [
    {
      id: 1,
      nom: "Grand Hôtel Martinez",
      localisation: "Cannes, Croisette",
      prix: 450,
      etoiles: 5,
      note: 4.8,
      nombreAvis: 1245,
      disponible: true,
      image: "/api/placeholder/400/250",
      description: "Hôtel de luxe situé sur la célèbre Croisette avec vue imprenable sur la Méditerranée. Service d'exception et prestations haut de gamme.",
      equipements: [
        { icon: Wifi, nom: "WiFi gratuit" },
        { icon: Car, nom: "Parking privé" },
        { icon: Waves, nom: "Plage privée" },
        { icon: Dumbbell, nom: "Salle de sport" },
        { icon: Utensils, nom: "Restaurant gastronomique" },
        { icon: AirVent, nom: "Climatisation" },
        { icon: Tv, nom: "TV satellite" },
        { icon: Coffee, nom: "Room service 24h" }
      ],
      galerie: [
        { url: "/api/placeholder/600/400", titre: "Façade principale" },
        { url: "/api/placeholder/600/400", titre: "Chambre luxe vue mer" },
        { url: "/api/placeholder/600/400", titre: "Restaurant Le Relais" },
        { url: "/api/placeholder/600/400", titre: "Plage privée" },
        { url: "/api/placeholder/600/400", titre: "Suite présidentielle" }
      ],
      avis: [
        { nom: "Marie L.", note: 5, commentaire: "Séjour exceptionnel ! Service impeccable et vue magnifique.", date: "15 mars 2024" },
        { nom: "Jean D.", note: 4, commentaire: "Très bel hôtel, petit-déjeuner délicieux. Rapport qualité-prix correct pour le standing.", date: "10 mars 2024" }
      ]
    },
    {
      id: 2,
      nom: "Boutique Hôtel Villa Victoria",
      localisation: "Nice, Vieux-Nice",
      prix: 180,
      etoiles: 4,
      note: 4.5,
      nombreAvis: 687,
      disponible: true,
      image: "/api/placeholder/400/250",
      description: "Charmant hôtel boutique au cœur du Vieux-Nice, alliant charme provençal et confort moderne.",
      equipements: [
        { icon: Wifi, nom: "WiFi gratuit" },
        { icon: AirVent, nom: "Climatisation" },
        { icon: Coffee, nom: "Petit-déjeuner" },
        { icon: Tv, nom: "TV écran plat" }
      ],
      galerie: [
        { url: "/api/placeholder/600/400", titre: "Hall d'accueil" },
        { url: "/api/placeholder/600/400", titre: "Chambre standard" },
        { url: "/api/placeholder/600/400", titre: "Terrasse" }
      ],
      avis: [
        { nom: "Sophie M.", note: 5, commentaire: "Parfait pour découvrir Nice à pied ! Personnel très accueillant.", date: "18 mars 2024" }
      ]
    },
    {
      id: 3,
      nom: "Hôtel Monaco Bay",
      localisation: "Monaco, Monte-Carlo",
      prix: 680,
      etoiles: 5,
      note: 4.9,
      nombreAvis: 892,
      disponible: false,
      image: "/api/placeholder/400/250",
      description: "Hôtel de prestige face au Casino de Monte-Carlo, symbole d'élégance et de raffinement monégasque.",
      equipements: [
        { icon: Wifi, nom: "WiFi gratuit" },
        { icon: Car, nom: "Voiturier" },
        { icon: Dumbbell, nom: "Spa & Fitness" },
        { icon: Utensils, nom: "Restaurant étoilé" },
        { icon: Coffee, nom: "Concierge 24h" }
      ],
      galerie: [
        { url: "/api/placeholder/600/400", titre: "Vue sur le Casino" },
        { url: "/api/placeholder/600/400", titre: "Suite royale" },
        { url: "/api/placeholder/600/400", titre: "Restaurant Le Joël" }
      ],
      avis: [
        { nom: "Pierre R.", note: 5, commentaire: "Expérience inoubliable ! Luxe absolu et service parfait.", date: "20 mars 2024" }
      ]
    }
  ];

  const handleSearch = () => {
    setCurrentStep('results');
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentStep('hotel');
  };

  const handleReservation = () => {
    setCurrentStep('payment');
  };

  const handlePayment = () => {
    // Simulation du traitement du paiement
    alert('Réservation confirmée ! Merci pour votre confiance.');
    setCurrentStep('search');
  };

  const renderStars = (nombre: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < nombre ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' €';
  };

  // Composant de recherche
  const SearchForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Réservez votre hôtel</h1>
          <p className="text-xl text-gray-600">Trouvez l&apos;hébergement parfait pour votre séjour</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchParams.localisation}
                onChange={(e) => setSearchParams({...searchParams, localisation: e.target.value})}
                placeholder="Où souhaitez-vous aller ?"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Arrivée</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchParams.dateArrivee}
                onChange={(e) => setSearchParams({...searchParams, dateArrivee: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Départ</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchParams.dateDepart}
                onChange={(e) => setSearchParams({...searchParams, dateDepart: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Voyageurs</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={searchParams.nombrePersonnes}
                onChange={(e) => setSearchParams({...searchParams, nombrePersonnes: parseInt(e.target.value)})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value={1}>1 personne</option>
                <option value={2}>2 personnes</option>
                <option value={3}>3 personnes</option>
                <option value={4}>4 personnes</option>
              </select>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Search className="w-5 h-5" />
          Rechercher des hôtels
        </button>
      </div>
    </div>
  );

  // Composant des résultats
  const ResultsList = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button 
            onClick={() => setCurrentStep('search')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Modifier la recherche
          </button>
          <div className="flex items-center gap-4 text-gray-600">
            <span><MapPin className="w-4 h-4 inline mr-1" />{searchParams.localisation || "Côte d'Azur"}</span>
            <span><Calendar className="w-4 h-4 inline mr-1" />{searchParams.dateArrivee || "Date d'arrivée"}</span>
            <span><Calendar className="w-4 h-4 inline mr-1" />{searchParams.dateDepart || "Date de départ"}</span>
            <span><Users className="w-4 h-4 inline mr-1" />{searchParams.nombrePersonnes} voyageur{searchParams.nombrePersonnes > 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{hotels.length} hôtels disponibles</h2>
        
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3">
                  <div className="h-64 lg:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-600">Photo de l&apos;hôtel</p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{hotel.nom}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{formatPrice(hotel.prix)}</div>
                        <div className="text-sm text-gray-500">par nuit</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(hotel.etoiles)}</div>
                      <span className="text-sm text-gray-600">({hotel.etoiles} étoiles)</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{hotel.localisation}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">{hotel.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{hotel.note}</span>
                        <span className="text-sm text-gray-500">({hotel.nombreAvis} avis)</span>
                      </div>
                      
                      {hotel.disponible ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          Disponible
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          Complet
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleHotelSelect(hotel)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Voir les détails
                    </button>
                    
                    {hotel.disponible && (
                      <button
                        onClick={() => {
                          setSelectedHotel(hotel);
                          handleReservation();
                        }}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                        Réserver maintenant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Composant fiche hôtel détaillée
  const HotelDetail = () => {
    if (!selectedHotel) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => setCurrentStep('results')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour aux résultats
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Galerie photos */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        {selectedHotel?.galerie[currentImageIndex]?.titre || "Photo de l'hôtel"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => setCurrentImageIndex(Math.min(selectedHotel?.galerie.length - 1, currentImageIndex + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedHotel?.galerie.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 bg-gray-200 rounded-lg ${
                          currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{selectedHotel?.description}</p>
              </div>
              
              {/* Équipements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Équipements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHotel?.equipements.map((equipement, index) => {
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
              
              {/* Avis clients */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
                <div className="space-y-4">
                  {selectedHotel?.avis.map((avis, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{avis.nom}</h4>
                            <span className="text-sm text-gray-500">{avis.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(avis.note)}
                          </div>
                          <p className="text-gray-700 text-sm">{avis.commentaire}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar réservation */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedHotel?.nom}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(selectedHotel?.etoiles)}</div>
                  <span className="text-sm text-gray-600">({selectedHotel?.etoiles} étoiles)</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{selectedHotel?.localisation}</span>
                </div>
                
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(selectedHotel?.prix)}
                </div>
                <div className="text-sm text-gray-500 mb-6">par nuit</div>
                
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrivée</span>
                    <span className="font-medium">{searchParams.dateArrivee || "À définir"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Départ</span>
                    <span className="font-medium">{searchParams.dateDepart || "À définir"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voyageurs</span>
                    <span className="font-medium">{searchParams.nombrePersonnes} personne{searchParams.nombrePersonnes > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{selectedHotel?.note}</span>
                  <span className="text-sm text-gray-500">({selectedHotel?.nombreAvis} avis)</span>
                </div>
                
                <button
                  onClick={handleReservation}
                  disabled={!selectedHotel?.disponible}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {selectedHotel?.disponible ? 'Réserver maintenant' : 'Non disponible'}
                </button>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favoris
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant de paiement
  const PaymentForm = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setCurrentStep('hotel')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Retour à la fiche hôtel
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Paiement sécurisé</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={paymentData.nom}
                    onChange={(e) => setPaymentData({...paymentData, nom: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input     
                  type="tel"
                  value={paymentData.telephone}
                  onChange={(e) => setPaymentData({...paymentData, telephone: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="06 12 34 56 78"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={paymentData.carteNumero}
                    onChange={(e) => setPaymentData({...paymentData, carteNumero: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d&apos;expiration</label>
                  <input
                    type="month"
                    value={paymentData.carteExpiration}
                    onChange={(e) => setPaymentData({...paymentData, carteExpiration: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={paymentData.carteCvv}
                    onChange={(e) => setPaymentData({...paymentData, carteCvv: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all mt-6"
            >
              Confirmer la réservation
            </button>
          </div>
          
          {/* Détails de la réservation */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails de la réservation</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Hôtel</span>
                <span className="font-medium">{selectedHotel?.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arrivée</span>
                <span className="font-medium">{searchParams.dateArrivee || "À définir"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Départ</span>
                <span className="font-medium">{searchParams.dateDepart || "À définir"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voyageurs</span>
                <span className="font-medium">{searchParams.nombrePersonnes} personne{searchParams.nombrePersonnes > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{selectedHotel?.prix}</span>
              </div>
            </div>   
          </div>
        </div>
      </div>
    </div>
  );

  // Rendu du composant principal
  return (
    <div>
      {currentStep === 'search' && <SearchForm />}
      {currentStep === 'results' && <ResultsList />}
      {currentStep === 'hotel' && <HotelDetail />}
      {currentStep === 'payment' && <PaymentForm />}
    </div>
  );
};

export default ReservationHotel;
