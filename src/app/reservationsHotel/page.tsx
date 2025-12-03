'use client'

import React, { useState } from 'react';
import {   
  MapPin,    
  Calendar,     
  Users,     
  Search,   
  Star,      
  User,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Lock,
  Eye
} from 'lucide-react';  
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mode, ReservationStatut, Type } from '@prisma/client'
import Image from 'next/image';

// 1. On définit le type des avis et galerie
interface Avis {
  nom: string
  note: number
  commentaire: string
  date: string
}

interface GalerieItem {
  id: number
  url: string
}

interface Equipement {
  icon: React.ComponentType<{ className?: string }>
  nom: string
}

interface SearchFormProps {
  searchParams: {
    destination: string;
    arrivee: string;
    depart: string;
    voyageurs: number;
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    destination: string;
    arrivee: string;
    depart: string;
    voyageurs: number;
  }>>;
  handleSearch: () => void;
}


// 2. Le type principal pour un hôtel
interface Hotel {
  id: number;
  nombreVoyageursMax: number;
  nombreEtoiles?: number;
  disponible?: boolean;
  equipements?: Equipement[];
  note?: number;
  nombreAvis?: number;     
  propriete: {
    id: number;
    nom: string;
    geolocalisation: string;
    images: { id: number; url: string }[];
    description: string;
    avis?: Avis[];
    prix?: number;
  };
  chambres: {
    id: number;
    nom: string;
    prixParNuit: number;
    capacite: number;
  }[];
  disponibilites: {
    id: number;
    startDate: string;
    endDate: string;
    disponible: boolean;
  }[];
}

type Step = 'search' | 'results' | 'hotel' | 'payment';

interface PaymentData {
  nom: string;
  email: string;
  telephone: string;
  carteNumero: string;
  carteExpiration: string;
  carteCvv: string;
  modePaiement: Mode; // 👈 lié à l’enum Mode de Prisma
}

// ✅ Déplace ton composant SearchForm ici
const SearchForm: React.FC<SearchFormProps & { isSearching: boolean }> = ({ searchParams, setSearchParams, handleSearch, isSearching }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
      <div className="text-center mb-8">
        <Link
          href="/dashboard/acheteur/"
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
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
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
              value={searchParams.arrivee}
              onChange={(e) => setSearchParams({ ...searchParams, arrivee: e.target.value })}
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
              value={searchParams.depart}
              onChange={(e) => setSearchParams({ ...searchParams, depart: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Voyageurs</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchParams.voyageurs}
              onChange={(e) => setSearchParams({ ...searchParams, voyageurs: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'personne' : 'personnes'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={isSearching}    
        className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300
          ${isSearching 
            ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          }`}
      >
        <Search className="w-5 h-5" />
        {isSearching ? 'Recherche en cours...' : 'Rechercher des hôtels'}
      </button>
    </div>
  </div>
)

export default function ReservationHotelPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState<Step>('search'); // search, results, hotel, payment
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchParams, setSearchParams] = useState({
    destination: "",
    arrivee: "",
    depart: "",  
    voyageurs: 2,
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    nom: '',
    email: '',
    telephone: '',
    carteNumero: '',
    carteExpiration: '',
    carteCvv: '',
    modePaiement: Mode.CARTEBANCAIRE, // 💳 valeur par défaut
  });

  const handleSearch = async () => {
    setLoading(true);
    setIsSearching(true)
    setError(null);
    try {
      const res = await fetch('/api/acheteur/rechercheHotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔑 pour envoyer la session
        body: JSON.stringify({
          destination: searchParams.destination,
          arrivee: searchParams.arrivee,
          depart: searchParams.depart,
          voyageurs: searchParams.voyageurs,
        }),
      });

      // Si la session est invalide ou inexistante
      if (res.status === 401) {
        router.push('/auth/login'); // ou '/auth/register'
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        
        setError(data.message || data.error || 'Aucun hôtel trouvé.');
        setHotels([]);
        setCurrentStep('results');
        return;
      }   

      // 👉 Ton API retourne :  { success, total, data: hotels }
      setHotels(data.data);
      setCurrentStep("results");
    } catch (err) {
      console.error('Erreur lors de la recherche.', err);
      setError('Erreur lors de la recherche.');
    } finally {
      setLoading(false);
      setIsSearching(false)
    }
  };

  const handleHotelSelect = async (hotelId: number) => {
    try {
      const res = await fetch(`/api/reservationsHotel/${hotelId}`, { method: 'GET' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Impossible de récupérer les détails de l’hôtel.');
        return;
      }
      setSelectedHotel(data.data);
      setCurrentStep('hotel');
    } catch (err) {
      console.error('Erreur serveur.', err);
      setError('Erreur serveur.');
    }
  };

  const handleReservation = () => {
    if (!session) {
      router.push('/auth/login'); // 🔐 redirection si non connecté
      return;
    }
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (!selectedHotel) {
      setError("Aucun hôtel sélectionné.");
      return;
    }

    try {
      const res = await fetch("/api/reservationsHotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          dateArrivee: searchParams.arrivee,
          dateDepart: searchParams.depart,
          nombreVoyageurs: searchParams.voyageurs,

          // 👇 liaison correcte avec le modèle Prisma
          proprieteId: selectedHotel.propriete?.id ?? null,

          // 👉 si ton utilisateur sélectionne une chambre spécifique
          chambreId:
            selectedHotel.chambres && selectedHotel.chambres.length > 0
              ? selectedHotel.chambres[0].id
              : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la réservation.");
        return;
      }

      alert("Réservation confirmée !");
      router.push("/dashboard/acheteur/mes-reservations");

    } catch (error) {
      console.error("Erreur paiement:", error);
      setError("Impossible de finaliser la réservation.");
    }
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
    return price?.toLocaleString('fr-FR') + ' €';
  };

  const getLowestPrice = (chambres: { prixParNuit: number }[]): number | null => {
    if (!chambres || chambres.length === 0) return null;
    return Math.min(...chambres.map((c) => c.prixParNuit));
  };

  // ✅ Rendu conditionnel selon l’étape
  if (currentStep === 'search')
    return <SearchForm {...{ searchParams, setSearchParams, handleSearch, isSearching }} />;

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
            <span><MapPin className="w-4 h-4 inline mr-1" />{searchParams.destination || "Lomé"}</span>
            <span><Calendar className="w-4 h-4 inline mr-1" />{searchParams.arrivee || "Date d'arrivée"}</span>
            <span><Calendar className="w-4 h-4 inline mr-1" />{searchParams.depart || "Date de départ"}</span>
            <span><Users className="w-4 h-4 inline mr-1" />{searchParams.voyageurs} voyageur{searchParams.voyageurs > 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{hotels?.length} hôtels disponibles</h2>
        
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel.propriete.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                      <h3 className="text-xl font-bold text-gray-900">{hotel.propriete.nom}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {hotel.chambres.length > 0 && getLowestPrice(hotel.chambres) !== null
                            ? formatPrice(getLowestPrice(hotel.chambres)!)
                            : "N/A"}
                        </div>

                        <div className="text-sm text-gray-500">à partir de / par nuit</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(hotel.nombreEtoiles ?? 0)}
                      </div>
                      <span className="text-sm text-gray-600">({hotel.nombreEtoiles ?? 0} étoiles)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{hotel.propriete.geolocalisation}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">{hotel.propriete.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      
                      
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
                      onClick={() => handleHotelSelect(hotel.id)}
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
                  {selectedHotel.propriete?.images?.length > 0 ? (
                    <img
                      src={selectedHotel.propriete?.images[currentImageIndex]?.url}
                      alt={`Photo ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">
                          Aucune image disponible
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Flèches de navigation */}
                  {selectedHotel.propriete?.images?.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev > 0 ? prev - 1 : selectedHotel.propriete?.images.length - 1
                          )
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev < selectedHotel.propriete?.images.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Miniatures */}
                {selectedHotel?.propriete?.images?.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedHotel?.propriete?.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index
                              ? 'border-blue-500'
                              : 'border-transparent'
                          }`}  
                        >
                          <Image
                            src={img.url}
                            alt={`Miniature ${index + 1}`}
                            width={80}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{selectedHotel?.propriete?.description}</p>
              </div>
              
              {/* Équipements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Équipements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHotel?.equipements?.map((equipement: Equipement, index: number) => {
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
                  {selectedHotel?.propriete?.avis?.map((avis: Avis, index: number) => (
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedHotel?.propriete?.nom}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(selectedHotel?.nombreEtoiles ?? 0)}</div>
                  <span className="text-sm text-gray-600">({selectedHotel?.nombreEtoiles} étoiles)</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{selectedHotel?.propriete?.geolocalisation}</span>
                </div>
                
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {selectedHotel?.chambres && selectedHotel.chambres.length > 0
                    ? formatPrice(selectedHotel.chambres[0].prixParNuit)
                    : "N/A"}
                </div>

                <div className="text-sm text-gray-500 mb-6">par nuit</div>
                
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrivée</span>
                    <span className="font-medium">{searchParams.arrivee || "À définir"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Départ</span>
                    <span className="font-medium">{searchParams.depart || "À définir"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voyageurs</span>
                    <span className="font-medium">{searchParams.voyageurs} personne{searchParams.voyageurs > 1 ? 's' : ''}</span>
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
                <span className="font-medium">{selectedHotel?.propriete?.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arrivée</span>
                <span className="font-medium">{searchParams.arrivee || "À définir"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Départ</span>
                <span className="font-medium">{searchParams.depart || "À définir"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voyageurs</span>
                <span className="font-medium">{searchParams.voyageurs} personne{searchParams.voyageurs > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{selectedHotel?.propriete?.prix}</span>
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
      {currentStep === 'results' && <ResultsList />}
      {currentStep === 'hotel' && <HotelDetail />}
      {currentStep === 'payment' && <PaymentForm />}
    </div>
  );
};

