'use client';  

import { useState, useEffect } from 'react';
import { Home, MapPin, Building, User } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CEA IMMO</span>
            </div>   

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-blue-600 font-medium">Accueil</Link>
              <Link href="proprietes" className="text-gray-700 hover:text-blue-600">Biens</Link>
              <Link href="/reservationsHotel" className="text-gray-700 hover:text-blue-600">Réservation hôtel</Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">Connexion</Link>
            </nav>  
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Mot-clé */}
            <div>
              <input
                type="text"
                placeholder="Mot-clé"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Localisation */}
            <div>
              <input
                type="text"
                placeholder="Localisation (ville, quartier...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>    

            {/* Type de bien */}  
            <div>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Type de bien</option>
                {Object.values(Categorie).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix min */}
            <div>
              <input
                type="text"
                placeholder="Prix min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Prix max et bouton rechercher */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Prix max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="">
              <button
                onClick={handleSearch}
                className=" px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Rechercher
              </button>
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

        {/* Témoignages */}
        <section className="mb-8">  
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Témoignages</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-visible">
            <Swiper
              modules={[Pagination, Autoplay]}  
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                768: { slidesPerView: 2 }, // 2 témoignages sur tablette
                1024: { slidesPerView: 3 }, // 3 témoignages sur desktop
              }}
            >
              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Excellent service, j&apos;ai trouvé la maison de mes rêves grâce à CEA IMMO.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Marie Diallo</p>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Processus rapide et transparent. Je recommande vivement.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Amadou Ba</p>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Équipe professionnelle et à l&apos;écoute de nos besoins.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Fatou Sow</p>
                </div>
              </SwiperSlide>

              {/* Nouveau slide 4 */}
              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Service irréprochable et équipe très réactive.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Moussa Diop</p>
                </div>
              </SwiperSlide>

              {/* Nouveau slide 5 */}
              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Une expérience très agréable, je recommande CEA IMMO !&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Awa Faye</p>
                </div>
              </SwiperSlide>

              {/* Nouveau slide 6 */}
              <SwiperSlide>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    &ldquo;Très satisfaite du suivi client et du professionnalisme de l&apos;équipe.&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900">Ousmane Ndao</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>  
        </section>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center space-y-1 text-blue-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">Maisons en location</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600">
            <MapPin className="h-6 w-6" />
            <span className="text-xs">Terrains à vendre</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600">
            <Building className="h-6 w-6" />
            <span className="text-xs">Réservation hôtel</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-600">
            <User className="h-6 w-6" />
            <span className="text-xs">Gestion chantier</span>
          </button>
        </div>
      </div>
    </div>
  )
}
