import React from "react";
import { MessageSquare } from "lucide-react";
import { OffreStatut } from '@prisma/client'

export interface User {
  id: number;
  prenom: string;
  nom: string;
}

export interface Property {
  id: number;
  nom: string;
  prix: number;
}

export interface Offer {
  id: number;
  user: User;
  propriete: Property;
  montant: number;
  message?: string;
  statut: OffreStatut;
  createdAt: string;
}

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const getStatusColor = (statut: OffreStatut) => {
    switch (statut) {
      case OffreStatut.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800";
      case OffreStatut.ACCEPTEE:
        return "bg-green-100 text-green-800";
      case OffreStatut.REFUSEE:
        return "bg-red-100 text-red-800";
      case OffreStatut.EXPIREE:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (statut: OffreStatut) => {
    switch (statut) {
      case OffreStatut.EN_ATTENTE:
        return "En attente";
      case OffreStatut.ACCEPTEE:
        return "Acceptée";
      case OffreStatut.REFUSEE:
        return "Refusée";
      case OffreStatut.EXPIREE:
        return "Expirée";
      default:
        return statut;
    }
  };

  const discount = (
    ((Number(offer.propriete.prix) - Number(offer.montant)) /
      Number(offer.propriete.prix)) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {offer.user.prenom} {offer.user.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{offer.propriete.nom}</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {Number(offer.montant).toLocaleString("fr-FR")} FCFA
            </span>
            <span className="text-sm text-gray-500">(-{discount}%)</span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            offer.statut
          )}`}
        >
          {getStatusLabel(offer.statut)}
        </span>
      </div>

      {offer.message && (
        <p className="text-sm text-gray-600 mb-3 italic">&quot;{offer.message}&quot;</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(offer.createdAt).toLocaleDateString("fr-FR")}
        </span>
        <div className="flex items-center space-x-2">
          {offer.statut === OffreStatut.EN_ATTENTE && (
            <>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700">
                Accepter
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
                Refuser
              </button>
            </>
          )}
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
