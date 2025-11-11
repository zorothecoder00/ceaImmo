'use client';  

import { useState, useEffect } from 'react';
import { Home, MapPin, Building, User, Sparkles, Search } from 'lucide-react';
import Image from 'next/image'
// 👉 Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';  
import 'swiper/css/autoplay';
import Link from "next/link"
import { Role, Categorie } from '@prisma/client'
import { useSession } from 'next-auth/react'; // 👈 Pour détecter la session utilisateur
import { useRouter } from 'next/navigation';  // 👈 Pour les redirections dynamiques

interface PropertyImage {
  id: number;
  url: string;
}

interface Property {
  id: number;
  nom: string;
  prix: number;
  categorie: Categorie;
  visiteVirtuelle?: string | null;
  images: PropertyImage[];
  geolocalisation: string;
}

interface PropertyFilters {
  nom?: string;
  geolocalisation?: string;
  categorie?: string;
  prixMin?: string | number;
  prixMax?: string | number;
}

export default function HomePage()
{
  const { data: session } = useSession(); // 👈 récupération de la session
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧩 Charger les propriétés initiales
  useEffect(() => {
    fetchProperties({});
  }, []);

  // 🔎 Fonction de recherche dynamique
  const fetchProperties = async (filters: PropertyFilters) => {
    try {
      setLoading(true);
      const searchParam = encodeURIComponent(JSON.stringify(filters));
      const res = await fetch(`/api/accueil?search=${searchParam}`);
      const data = await res.json();
      setProperties(data.data || []);
    } catch (error) {
      console.error('Erreur de chargement des propriétés', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Gérer la recherche
  const handleSearch = () => {
    const filters: PropertyFilters = {
      nom: searchKeyword || undefined,
      geolocalisation: location || undefined,
      categorie: propertyType || undefined,
      prixMin: minPrice || undefined,
      prixMax: maxPrice || undefined,
    };
    fetchProperties(filters);
  };

  // 🔗 Redirection "Voir tout"
  const handleVoirTout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/login');
    } else if (session.user?.role === Role.ACHETEUR) {
      router.push('/dashboard/acheteur/recherches');
    } else {
      router.push('/dashboard');
    }
  };

  // 🔗 Redirection "Détails"
  const handleDetails = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/login');
    } else if (session.user?.role === Role.ACHETEUR) {
      router.push(`/dashboard/acheteur/recherches/${id}`);
    } else {
      router.push('/dashboard');
    }
  };

  const testimonials = [
    { name: "Marie Diallo", text: "Excellent service, j'ai trouvé la maison de mes rêves grâce à CEA IMMO." },
    { name: "Amadou Ba", text: "Processus rapide et transparent. Je recommande vivement." },
    { name: "Fatou Sow", text: "Équipe professionnelle et à l'écoute de nos besoins." },
    { name: "Moussa Diop", text: "Service irréprochable et équipe très réactive." },
    { name: "Awa Faye", text: "Une expérience très agréable, je recommande CEA IMMO !" },
    { name: "Ousmane Ndao", text: "Très satisfaite du suivi client et du professionnalisme de l'équipe." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header avec effet glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo amélioré */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl transform group-hover:scale-110 transition-transform">
                  <Home className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CEA IMMO</span>
                <p className="text-xs text-gray-500 font-medium">Votre partenaire immobilier</p>
              </div>
            </div>   

            {/* Navigation moderne */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="#" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                Accueil
              </Link>
              <Link href="proprietes" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-white/80 hover:text-blue-600 transition-all">
                Biens
              </Link>
              <Link href="/reservationsHotel" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-white/80 hover:text-blue-600 transition-all">
                Réservation hôtel
              </Link>
              <Link href="/auth/login" className="px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-all ml-2">
                Connexion
              </Link>
            </nav>  
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section avec recherche intégrée */}
        <div className="relative overflow-hidden">
          {/* Effet de fond animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Titre Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Trouvez votre bien idéal</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                Votre <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">nouveau chez-vous</span>
                <br />commence ici
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez des milliers de propriétés exceptionnelles et trouvez celle qui vous ressemble
              </p>
            </div>

            {/* Formulaire de recherche modernisé */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Mot-clé */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mot-clé</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Villa, appartement..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Localisation */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ville, quartier..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>    

                {/* Type de bien */}  
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type de bien</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none bg-white"
                    >
                      <option value="">Tous les types</option>
                      {Object.values(Categorie).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prix min */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prix minimum</label>
                  <input
                    type="text"
                    placeholder="Ex: 10 000 000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                {/* Prix max */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prix maximum</label>
                  <input
                    type="text"
                    placeholder="Ex: 50 000 000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                {/* Bouton rechercher */}
                <div className="lg:col-span-2 flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>Rechercher</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propriétés / Visites virtuelles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {properties.some(p => p.visiteVirtuelle) ? 'Visites virtuelles' : 'Propriétés'}
            </h2>
            {properties.length > 0 && (
              <button
                onClick={handleVoirTout}
                className="text-blue-600 font-medium hover:underline"
              >
                Voir tout
              </button>
            )}
          </div>

          {loading ? (
            <p className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto">
              Chargement des propriétés...
            </p>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun résultat trouvé.</p>
              <button
                onClick={handleVoirTout}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voir toutes les propriétés
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={property.images?.[0]?.url || "/villapiscine.webp"}
                      alt={property.nom}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {property.visiteVirtuelle && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                          Visite virtuelle
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDetails(property.id, e)}
                        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-900"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.nom}
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {property.prix.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Témoignages modernisés */}
        <section className="mb-12">  
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">💬 Ce que disent nos clients</h2>
            <p className="text-gray-600">Des milliers de clients satisfaits nous font confiance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation modernisée */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 px-4 py-3 shadow-2xl z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center space-y-1 text-blue-600 transform hover:scale-110 transition-transform">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">Location</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all">
            <div className="hover:bg-blue-100 p-2 rounded-xl transition-colors">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Terrains</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all">
            <div className="hover:bg-blue-100 p-2 rounded-xl transition-colors">
              <Building className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Hôtels</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all">
            <div className="hover:bg-blue-100 p-2 rounded-xl transition-colors">
              <User className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Chantier</span>
          </button>
        </div>
      </div>
    </div>
  )
}
