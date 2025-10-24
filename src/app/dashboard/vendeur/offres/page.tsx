'use client'

import React, { useState } from 'react';
import { Home, Search, Heart, Calendar, Briefcase, Settings } from 'lucide-react';

type OfferStatus = "pending" | "processing" | "accepted" | "rejected";

interface Offer {
  id: number;
  title: string;
  location: string;
  details: string[];
  amount: string;
  date: string;
  status: OfferStatus;
  type: "vente" | "location";
}


const MesOffres = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const offers: Offer[] = [
    {
      id: 1,
      title: "Appartement Lumineux Centre-ville",
      location: "15 Rue de la République, Lyon 2ème",
      details: ["3 pièces", "2 chambres", "75 m²"],
      amount: "320 000 €",
      date: "12/09/2025",
      status: "pending",
      type: "vente"
    },
    {
      id: 2,
      title: "Maison avec Jardin",
      location: "23 Avenue des Chênes, Villeurbanne",
      details: ["5 pièces", "4 chambres", "120 m²", "Jardin 200m²"],
      amount: "485 000 €",
      date: "10/09/2025",
      status: "processing",
      type: "vente"
    },
    {
      id: 3,
      title: "Studio Moderne Montparnasse",
      location: "8 Rue de Rennes, Paris 14ème",
      details: ["1 pièce", "25 m²", "Métro 2min"],
      amount: "1 200 €/mois",
      date: "08/09/2025",
      status: "accepted",
      type: "location"
    },
    {
      id: 4,
      title: "Loft Industriel Belleville",
      location: "45 Rue de Belleville, Paris 20ème",
      details: ["2 pièces", "1 chambre", "60 m²", "Loft"],
      amount: "2 100 €/mois",
      date: "05/09/2025",
      status: "rejected",
      type: "location"
    },
    {
      id: 5,
      title: "Appartement Haussmannien",
      location: "12 Boulevard Saint-Germain, Paris 5ème",
      details: ["4 pièces", "3 chambres", "95 m²", "Haussmannien"],
      amount: "850 000 €",
      date: "13/09/2025",
      status: "pending",
      type: "vente"
    }
  ];

  const getStatusBadge = (status: OfferStatus) => {
  const statusConfig: Record<OfferStatus, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'En cours', className: 'bg-blue-100 text-blue-800' },
    accepted: { label: 'Acceptée', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Refusée', className: 'bg-red-100 text-red-800' }
  };

  return statusConfig[status];
};

  const getActionButtons = (status: OfferStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Modifier l&apos;offre 
            </button>
            <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Retirer l&apos;offre
            </button>
          </div>
        );
      case 'processing':
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Voir la négociation
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Contacter l&apos;agent
            </button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Finaliser le dossier
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Télécharger le contrat
            </button>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Faire une nouvelle offre
            </button>
            <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Voir des biens similaires
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredOffers = activeFilter === 'all' 
    ? offers 
    : offers.filter(offer => offer.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
            + Nouvelle recherche
          </button>
        </div>
        
        <nav className="px-6">
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Home className="w-5 h-5 mr-3" />
            Tableau de bord
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Search className="w-5 h-5 mr-3" />
            Rechercher
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Heart className="w-5 h-5 mr-3" />
            Mes favoris
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Calendar className="w-5 h-5 mr-3" />
            Mes visites
          </a>
          <a href="#" className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100">
            <Briefcase className="w-5 h-5 mr-3" />
            Mes offres
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes Offres</h1>
          <p className="text-gray-600">Suivez l&apos;état de vos offres d&apos;achat et de location</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'pending', label: 'En attente' },
            { key: 'processing', label: 'En cours' },
            { key: 'accepted', label: 'Acceptées' },
            { key: 'rejected', label: 'Refusées' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
          {filteredOffers.map(offer => {
            const statusBadge = getStatusBadge(offer.status);
            return (
              <div key={offer.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      📍 {offer.location}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {offer.details.map((detail, index) => (
                        <span key={index}>
                          {index === 0 && '🏠 '}
                          {index === 1 && '🛏️ '}
                          {index === 2 && '📐 '}
                          {index === 3 && (detail.includes('Jardin') ? '🌳 ' : detail.includes('Métro') ? '🚇 ' : '🏢 ')}
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wide ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-green-600">{offer.amount}</div>
                  <div className="text-sm text-gray-600">Offre du {offer.date}</div>
                </div>
                
                {getActionButtons(offer.status)}
              </div>
            );
          })}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600">Aucune offre ne correspond aux critères sélectionnés.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesOffres;