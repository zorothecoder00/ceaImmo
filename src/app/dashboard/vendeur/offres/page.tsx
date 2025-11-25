'use client'
   
import React, { useState, useEffect } from 'react';
import { Home, Search, Heart, Calendar, Briefcase, Settings } from 'lucide-react';
import { OffreStatut } from '@prisma/client'
import Link from 'next/link'
  
 interface Propriete {
  id: number   
  nom: string    
  prix?: number
  surface?: number  
  geolocalisation?: string
  nombreChambres?: number
}
 
interface Offer {
  id: number
  montant: number
  message?: string
  propriete: Propriete
  createdAt: string
  statut: OffreStatut
}


const MesOffres = () => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pending' | 'accepted' | 'rejected' | 'expired'
  >('all')
  const [offers, setOffers] = useState<Offer[]>([]);

  // 🔄 Chargement des offres depuis ton API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/vendeur/mesOffres')
        const data = await res.json()
        setOffers(data.data)
      } catch (error) {
        console.error('Erreur lors du chargement des offres', error)
      }
    }

    fetchOffers()
  }, [])

   // 🔧 Modifier le statut ou l'offre
  const handleAction = async (id: number, action: 'modifier' | 'accepter' | 'retirer', montant?: number, message?: string) => {
  try {
    const res = await fetch(`/api/vendeur/mesOffres/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, montant, message }),
    });
    const data = await res.json();
    console.log('PATCH Response:', res.status, data);
    if (!res.ok) throw new Error(data.error || 'Erreur serveur');

    const updatedOffer = data.data;

    setOffers(prev =>
      prev.map(offer =>
        offer.id === id ? { ...offer, statut: updatedOffer.statut } : offer
      )
    );

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre', error);
  }
};



  const getStatusBadge = (statut: OffreStatut) => {
  const statusConfig: Record<OffreStatut, { label: string; className: string }> = {
    EN_ATTENTE: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
    EXPIREE: { label: 'Expirée', className: 'bg-blue-100 text-blue-800' },
    ACCEPTEE: { label: 'Acceptée', className: 'bg-green-100 text-green-800' },
    REFUSEE: { label: 'Refusée', className: 'bg-red-100 text-red-800' }
  };

  return statusConfig[statut];
};

  const getActionButtons = (offer: Offer) => {
    switch (offer.statut) {
      case OffreStatut.EN_ATTENTE:
      return (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleAction(offer.id, 'modifier', offer.montant, offer.message)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Modifier l&apos;offre
          </button>

          <button
            onClick={() => handleAction(offer.id, 'retirer')}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Refuser l&apos;offre
          </button>

          <button
            onClick={() => handleAction(offer.id, 'accepter')}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Accepter l&apos;offre
          </button>
        </div>
      );
      case OffreStatut.EXPIREE:
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Réactiver l&apos;offre
            </button>
          </div>
        );
      case OffreStatut.ACCEPTEE:
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
      case OffreStatut.REFUSEE:
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

  // ✅ Correction du filtre
  const filteredOffers =
    activeFilter === 'all'
      ? offers
      : offers.filter((offer) => {
          if (activeFilter === 'pending') return offer.statut === OffreStatut.EN_ATTENTE;
          if (activeFilter === 'accepted') return offer.statut === OffreStatut.ACCEPTEE;
          if (activeFilter === 'rejected') return offer.statut === OffreStatut.REFUSEE;
          if (activeFilter === 'expired') return offer.statut === OffreStatut.EXPIREE;
          return true;
        });

  type FilterKey = 'all' | 'pending' | 'accepted' | 'rejected' | 'expired';

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'accepted', label: 'Acceptées' },
    { key: 'rejected', label: 'Refusées' },
    { key: 'expired', label: 'Expirées' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">   
        <div className="p-6">
          
        </div>
        
        <nav className="px-6">
          <Link href="/dashboard/vendeur" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Home className="w-5 h-5 mr-3" />
            ← Tableau de bord
          </Link>
        
          <Link href="/dashboard/vendeur/visites" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Calendar className="w-5 h-5 mr-3" />
            Mes visites
          </Link>
          <Link href="/dashboard/vendeur/offres" className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100">
            <Briefcase className="w-5 h-5 mr-3" />
            Mes offres
          </Link>
          <Link href="/dashboard/vendeur/parametres" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </Link>
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
          {filters.map((filter) => (
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
            const statusBadge = getStatusBadge(offer.statut);
            return (  
              <div key={offer.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.propriete.nom}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      📍 {offer.propriete.geolocalisation || 'Localisation inconnue'}
                    </p>
                    <p className="text-sm text-gray-700">
                      🏠 {offer.propriete.surface ? offer.propriete.surface.toString() : '?'} m² — 💰{' '}
                      {offer.propriete.prix?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wide ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-green-600">{offer.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                  <div className="text-sm text-gray-600">Offre du {new Date(offer.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
                
                {getActionButtons(offer)}
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