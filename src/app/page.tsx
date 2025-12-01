'use client';  

import { useState, useEffect } from 'react';
import { Home, MapPin, Building, User, Sparkles, Search, ChevronRight } from 'lucide-react';
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
  const { data: session, status } = useSession(); // 👈 récupération de la session
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    if (status === "loading") return; // on attend brièvement

    if (status === "unauthenticated" || !session) {
      router.push("/auth/login?redirect=voir-tout");
      return;
    }

    if (session.user?.role === Role.ACHETEUR) {
      router.push("/dashboard/acheteur/recherches");
    } else {
      router.push("/dashboard");
    }
  };


  // 🔗 Redirection "Détails"
  const handleDetails = (id: number, e: React.MouseEvent) => {
    e.preventDefault();

    if (status === "loading") return; // on attend brièvement
    
    if (status === "unauthenticated" || !session) {
      router.push(`/auth/login?redirect=details&id=${id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
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

      {/* ----- MENU MOBILE ----- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-b border-gray-200 px-6 py-4 space-y-4 z-50">
          <Link href="/" className="block text-gray-800 font-medium py-2">Accueil</Link>
          <Link href="/proprietes" className="block text-gray-800 font-medium py-2">Biens</Link>
          <Link href="/reservationsHotel" className="block text-gray-800 font-medium py-2">
            Réservation hôtel
          </Link>
          <Link href="/auth/login" className="block text-gray-800 font-medium py-2">Connexion</Link>
        </div>
      )}



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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Propriétés / Visites virtuelles */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {properties.some(p => p.visiteVirtuelle) ? '✨ Visites virtuelles disponibles' : '🏠 Propriétés disponibles'}
                </h2>
                <p className="text-gray-600">Découvrez notre sélection de biens d&apos;exception</p>
              </div>
              {properties.length > 0 && (
                <button
                  onClick={handleVoirTout}
                  className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                >
                  <span>Voir tout</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Chargement des propriétés...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez d&apos;ajuster vos critères de recherche</p>
                <button
                  onClick={handleVoirTout}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
                >
                  Voir toutes les propriétés
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                      <img
                        src={property.images?.[0]?.url || "/api/placeholder/400/300"}
                        alt={property.nom}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full shadow-lg">
                          {property.categorie}
                        </span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {property.visiteVirtuelle && (
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-lg flex items-center space-x-1">
                            <Sparkles className="h-4 w-4" />
                            <span>Visite 360°</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDetails(property.id, e)}
                          className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 shadow-lg"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {property.nom}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.geolocalisation}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Prix</p>
                          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {property.prix?.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">FCFA</span>
                      </div>
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
