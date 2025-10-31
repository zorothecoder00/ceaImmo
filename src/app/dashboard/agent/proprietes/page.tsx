"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Clock,
  Star,
} from "lucide-react";
import Image from 'next/image'

/**
 * Types frontend (mirrors minimalement ton schema Prisma + champs UI optionnels)
 * -> Ne pas importer @prisma/client dans un composant client : on duplique ici.
 */

type Categorie = "VILLA" | "MAISON" | "APPARTEMENT" | "HOTEL" | "TERRAIN" | "CHANTIER";
type Statut = "VENDU" | "DISPONIBLE" | "RESERVE" | "EN_LOCATION" | "EN_NEGOCIATION";

interface Proprietaire {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  photo?: string | null;
}

interface UiPropriete {
  id: number;
  nom: string;
  description?: string | null;
  categorie: Categorie;
  prix: number;
  surface: number;
  statut: Statut;
  geolocalisation: string;
  nombreChambres: number;
  // Dans Prisma tu as ProprieteImage[] ; côté frontend on veut un tableau d'URL
  images: string[]; 
  proprietaire?: Proprietaire | null;

  // Champs UI / statistiques (ils n'existent pas nativement dans prisma/propriete,
  // soit tu les calcules côté serveur soit tu les gardes optionnels ici)
  visites?: number;
  offresRecues?: number;
  offresMoyenne?: number;
  tempsMandat?: string;
  commission?: number;
  dateMandat?: string;
  notesAgent?: string | null;
  derniereVisite?: string | null;
  prochainRdv?: string | null;
}

export default function AgentProprietesPage() {
  // On précise le type ici pour éviter `never[]`
  const [proprietes, setProprietes] = useState<UiPropriete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState<Categorie | "TOUS">("TOUS");
  const [filterStatut, setFilterStatut] = useState<Statut | "TOUS">("TOUS");

  useEffect(() => {
    // mockData typé correctement
    const mockProprietes: UiPropriete[] = [
      {
        id: 1,
        nom: "Appartement Moderne",
        categorie: "APPARTEMENT",
        prix: 850000,
        surface: 120,
        statut: "DISPONIBLE",
        geolocalisation: "Lomé Centre",
        nombreChambres: 3,
        images: ["/api/placeholder/400/300"],
        proprietaire: {
          id: 10,
          nom: "Koffi",
          prenom: "Jean-Claude",
          email: "jc.koffi@email.com",
          photo: "/api/placeholder/50/50",
        },
        visites: 8,
        offresRecues: 3,
        offresMoyenne: 780000,
        tempsMandat: "3 mois",
        commission: 4.5,
        dateMandat: "2023-11-01",
        notesAgent: "Client motivé, flexible sur les visites. Préfère les matinées.",
        derniereVisite: "2024-01-25",
        prochainRdv: "2024-02-02",
      },
      {
        id: 2,
        nom: "Villa de Luxe",
        categorie: "VILLA",
        prix: 2500000,
        surface: 350,
        statut: "EN_NEGOCIATION",
        geolocalisation: "Baguida",
        nombreChambres: 5,
        images: ["/api/placeholder/400/300"],
        proprietaire: {
          id: 11,
          nom: "Attiogbe",
          prenom: "Marie",
          email: "marie.attiogbe@email.com",
          photo: "/api/placeholder/50/50",
        },
        visites: 12,
        offresRecues: 2,
        offresMoyenne: 2350000,
        tempsMandat: "6 mois",
        commission: 3.5,
        dateMandat: "2023-08-15",
        notesAgent: "Négociation en cours avec acheteur sérieux. RDV notaire prévu.",
        derniereVisite: "2024-01-28",
        prochainRdv: "2024-02-05",
      },
      {
        id: 3,
        nom: "Studio Centre-ville",
        categorie: "APPARTEMENT",
        prix: 300000,
        surface: 45,
        statut: "RESERVE",
        geolocalisation: "Lomé Centre",
        nombreChambres: 1,
        images: ["/api/placeholder/400/300"],
        proprietaire: {
          id: 12,
          nom: "Mensah",
          prenom: "Paul",
          email: "paul.mensah@email.com",
          photo: "/api/placeholder/50/50",
        },
        visites: 15,
        offresRecues: 5,
        offresMoyenne: 285000,
        tempsMandat: "2 mois",
        commission: 5.0,
        dateMandat: "2023-12-01",
        notesAgent: "Compromis signé, attente financement banque acheteur.",
        derniereVisite: "2024-01-20",
        prochainRdv: null,
      },
    ];

    // simulate fetch
    setTimeout(() => {
      setProprietes(mockProprietes);
      setLoading(false);
    }, 800);
  }, []);

  // Typage des paramètres pour éviter `any` implicite
  const getStatutColor = (statut: Statut | string) => {
    switch (statut) {
      case "DISPONIBLE":
        return "bg-green-100 text-green-800";
      case "RESERVE":
        return "bg-yellow-100 text-yellow-800";
      case "EN_NEGOCIATION":
        return "bg-blue-100 text-blue-800";
      case "VENDU":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategorieIcon = (categorie: Categorie | string) => {
    switch (categorie) {
      case "VILLA":
        return "🏡";
      case "MAISON":
        return "🏠";
      case "APPARTEMENT":
        return "🏢";
      case "HOTEL":
        return "🏨";
      case "TERRAIN":
        return "🌍";
      case "CHANTIER":
        return "🚧";
      default:
        return "🏠";
    }
  };

  const filteredProprietes = proprietes.filter((prop) => {
    const term = searchTerm.trim().toLowerCase();
    const ownerName = `${prop.proprietaire?.prenom ?? ""} ${prop.proprietaire?.nom ?? ""}`.toLowerCase();

    const matchesSearch =
      !term ||
      prop.nom.toLowerCase().includes(term) ||
      prop.geolocalisation.toLowerCase().includes(term) ||
      ownerName.includes(term);

    const matchesCategorie = filterCategorie === "TOUS" || prop.categorie === filterCategorie;
    const matchesStatut = filterStatut === "TOUS" || prop.statut === filterStatut;

    return matchesSearch && matchesCategorie && matchesStatut;
  });

  const stats = {
    totalMandats: proprietes.length,
    disponibles: proprietes.filter((p) => p.statut === "DISPONIBLE").length,
    enNegociation: proprietes.filter((p) => p.statut === "EN_NEGOCIATION").length,
    totalVisites: proprietes.reduce((sum, p) => sum + (p.visites ?? 0), 0),
    commissionMoyenne:
      proprietes.length > 0 ? proprietes.reduce((sum, p) => sum + (p.commission ?? 0), 0) / proprietes.length : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mandats de Vente</h1>
            <p className="text-gray-600">Gérez les propriétés confiées par vos clients</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planifier visite
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Building className="h-5 w-5" />
              Nouveau mandat
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* ... cards (identique au code original, j'ai conservé les mêmes JSX) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mandats actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMandats}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.disponibles}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En négociation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enNegociation}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total visites</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVisites}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Commission moy.</p>
                <p className="text-2xl font-bold text-gray-900">{stats.commissionMoyenne.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par propriété, localisation ou propriétaire..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value as Categorie | "TOUS")}
              >
                <option value="TOUS">Toutes catégories</option>
                <option value="VILLA">Villa</option>
                <option value="MAISON">Maison</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="HOTEL">Hôtel</option>
                <option value="TERRAIN">Terrain</option>
                <option value="CHANTIER">Chantier</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value as Statut | "TOUS")}
              >
                <option value="TOUS">Tous statuts</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="RESERVE">Réservé</option>
                <option value="EN_NEGOCIATION">En négociation</option>
                <option value="VENDU">Vendu</option>
                <option value="EN_LOCATION">En location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-6">
          {filteredProprietes.map((propriete) => (
            <div key={propriete.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={propriete.images[0] ?? "/api/placeholder/400/300"}
                      alt={propriete.nom}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(propriete.statut)}`}>
                        {propriete.statut.replace("_", " ")}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white px-2 py-1 rounded-full text-sm">
                        {getCategorieIcon(propriete.categorie)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 lg:w-3/4 p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between">
                    <div className="lg:w-2/3">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{propriete.nom}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{propriete.geolocalisation}</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-3">
                            {propriete.prix.toLocaleString()} € 
                            <span className="text-sm text-gray-500 ml-2">
                              (Commission: {propriete.commission ?? 0}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Propriétaire */}
                      {propriete.proprietaire && (
                        <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                          <Image
                            src={propriete.proprietaire.photo ?? "/api/placeholder/50/50"}
                            alt=""
                            className="h-10 w-10 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {propriete.proprietaire.prenom} {propriete.proprietaire.nom}
                            </p>
                            <p className="text-sm text-gray-600">{propriete.proprietaire.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Notes Agent */}
                      {propriete.notesAgent && (
                        <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {propriete.notesAgent}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="lg:w-1/3 lg:pl-6">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600 mb-1">Surface</p>
                          <p className="font-semibold">{propriete.surface}m²</p>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600 mb-1">Chambres</p>
                          <p className="font-semibold">{propriete.nombreChambres}</p>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600 mb-1">Visites</p>
                          <p className="font-semibold text-blue-600">{propriete.visites ?? 0}</p>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600 mb-1">Offres reçues</p>
                          <p className="font-semibold text-green-600">{propriete.offresRecues ?? 0}</p>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600 mb-1">Mandat depuis</p>
                          <p className="font-semibold">{propriete.tempsMandat ?? "-"}</p>
                        </div>
                        {propriete.prochainRdv && (
                          <div className="text-center lg:text-left">
                            <p className="text-sm text-gray-600 mb-1">Prochain RDV</p>
                            <p className="font-semibold text-orange-600">
                              {new Date(propriete.prochainRdv).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
