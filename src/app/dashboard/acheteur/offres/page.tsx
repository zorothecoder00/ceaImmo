'use client'       

import React, { useState, useEffect } from 'react'
import { Home, Search, Heart, Calendar, Briefcase, Settings } from 'lucide-react'
import { OffreStatut } from '@prisma/client'
import Link from "next/link"; // assure-toi d'importer Link en haut du fichier

interface Proprietaire {
  id: number       
  prenom: string     
  nom: string
}
   
interface Propriete {
  id: number
  nom: string
  prix?: number
  surface?: number
  geolocalisation?: string
  nombreChambres?: number
  proprietaire?: Proprietaire
}

interface Offre {
  id: number
  montant: number
  message?: string
  propriete: Propriete
  createdAt: string
  statut: OffreStatut
}

const MesOffres = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | OffreStatut>('ALL')
  const [offres, setOffres] = useState<Offre[]>([])

  // 🔄 Chargement des offres depuis ton API
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch('/api/acheteur/mesOffres')
        const data = await res.json()
        setOffres(data.data)
      } catch (error) {
        console.error('Erreur lors du chargement des offres', error)
      }
    }

    fetchOffres()
  }, [])

  const refreshOffers = async () => {
    try {
      const res = await fetch('/api/acheteur/mesOffres')
      const data = await res.json()
      setOffres(data.data)
    } catch (error) {
      console.error('Erreur lors du rechargement des offres', error)
    }
  }


  // 🎨 Style et label selon le statut
  const getStatusBadge = (statut: OffreStatut) => {
    const statusConfig: Record<OffreStatut, { label: string; className: string }> = {
      EN_ATTENTE: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      EXPIREE: { label: 'Expirée', className: 'bg-blue-100 text-blue-800' },
      ACCEPTEE: { label: 'Acceptée', className: 'bg-green-100 text-green-800' },
      REFUSEE: { label: 'Refusée', className: 'bg-red-100 text-red-800' },
    }
    return statusConfig[statut]
  }

  // ⚙️ Boutons selon le statut
  const getActionButtons = (offre: Offre, refreshOffers: () => void) => {
    const handlePatch = async (action: "modifier" | "retirer", payload?: { montant?: number; message?: string }) => {
      try {
        const res = await fetch(`/api/acheteur/mesOffres/${offre.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...payload }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur inconnue");

        alert(data.message);
        refreshOffers(); // pour recharger la liste après modification
      } catch (error) {
        console.error("Erreur lors de la mise à jour", error);
      }
    };

    switch (offre.statut) {
      case OffreStatut.EN_ATTENTE:
        return (
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                const nouveauMontant = prompt("Montant de l'offre :", String(offre.montant));
                const nouveauMessage = prompt("Message :", offre.message || "");
                if (nouveauMontant) {
                  handlePatch("modifier", { montant: Number(nouveauMontant), message: nouveauMessage || undefined });
                }
              }}
            >
              Modifier l&apos;offre
            </button>

            <button
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => handlePatch("retirer")}
            >
              Retirer l&apos;offre
            </button>
          </div>
        );

      case OffreStatut.ACCEPTEE:
        return (
          <div className="flex gap-2 mt-4">
            <Link href="/dashboard/acheteur/transactions">
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                💳 Procéder au paiement
              </button>
            </Link>
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

      case OffreStatut.EXPIREE:
        return (
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Réactiver l&apos;offre
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // 🔍 Filtrage selon le statut
  const filteredOffres =
    activeFilter === 'ALL' ? offres : offres.filter((o) => o.statut === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}   
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <Link
            href="/dashboard/acheteur"
            className="inline-block mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            ← Retour au dashboard
          </Link>
        </div>

        <nav className="px-6">
          <Link
            href="/dashboard/acheteur"
            className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors"
          >
            <Home className="w-5 h-5 mr-3" />
            Tableau de bord
          </Link>
          <Link
            href="/dashboard/acheteur/recherches"
            className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors"
          >
            <Search className="w-5 h-5 mr-3" />
            Rechercher
          </Link>
          <Link  
            href="/dashboard/acheteur/favoris"
            className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors"
          >
            <Heart className="w-5 h-5 mr-3" />
            Mes favoris
          </Link>
          <Link
            href="/dashboard/acheteur/visites"
            className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Mes visites
          </Link>
          <Link
            href="/dashboard/acheteur/offres"
            className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100"
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Mes offres
          </Link>  
          <Link
            href="/dashboard/acheteur/parametres"
            className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </Link>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes Offres</h1>
          <p className="text-gray-600">
            Suivez l&apos;état de vos offres d&apos;achat et de location
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['ALL', 'EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'EXPIREE'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 ${
                activeFilter === key
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-600'
              }`}
            >
              {key === 'ALL'
                ? 'Toutes'
                : key === 'EN_ATTENTE'
                ? 'En attente'
                : key === 'ACCEPTEE'
                ? 'Acceptées'
                : key === 'REFUSEE'
                ? 'Refusées'
                : 'Expirées'}
            </button>
          ))}
        </div>

        {/* Liste des offres */}
        <div className="space-y-6">
          {filteredOffres.map((offre) => {
            const badge = getStatusBadge(offre.statut)
            return (
              <div
                key={offre.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {offre.propriete.nom}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      📍 {offre.propriete.geolocalisation}
                    </p>
                    <p className="text-sm text-gray-700">
                      🏠 {(offre.propriete.surface ?? '?').toString()} m² — 💰{' '}
                      {Number(offre.propriete.prix ?? 0).toLocaleString()} €
                    </p>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wide ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-green-600">{offre.montant} €</div>
                  <div className="text-sm text-gray-600">
                    Envoyée le {new Date(offre.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {getActionButtons(offre, refreshOffers)}
              </div>
            )
          })}

          {filteredOffres.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-600">
                Aucune offre ne correspond aux critères sélectionnés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MesOffres
