// src/components/VisitCard.tsx
'use client'

import React from "react";
import { Calendar, User, Phone, MessageSquare } from "lucide-react";
import { VisiteStatut } from "@prisma/client";

export interface UserInfo {
  id: number;
  prenom: string;
  nom: string;
  email?: string;
}

export interface Property {
  id: number;
  nom: string;
}

export interface Visit {
  id: number;
  user?: UserInfo;
  propriete?: Property;
  date: string | Date;
  statut: VisiteStatut;
  agent?: UserInfo;
}

interface VisitCardProps {
  visit: Visit;
}

export default function VisitCard({ visit }: VisitCardProps) {  
  const getStatusColor = (statut: VisiteStatut) => {
    switch (statut) {
      case VisiteStatut.CONFIRMEE: return 'bg-green-100 text-green-800';
      case VisiteStatut.DEMANDEE: return 'bg-blue-100 text-blue-800';
      case VisiteStatut.ANNULEE: return 'bg-red-100 text-red-800';
      case VisiteStatut.REPORTEE: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut: VisiteStatut) => {
    switch (statut) {
      case VisiteStatut.CONFIRMEE: return 'Confirmée';
      case VisiteStatut.DEMANDEE: return 'Demandée';
      case VisiteStatut.ANNULEE: return 'Annulée';
      case VisiteStatut.REPORTEE: return 'Reportée';
      default: return statut;
    }
  };  

  const visitDate = new Date(visit.date);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {visit.user?.prenom} {visit.user?.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{visit.propriete?.nom}</p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {visitDate.toLocaleDateString('fr-FR')} à {visitDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {visit.user?.email && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <User className="h-4 w-4 mr-2" />
              {visit.user.email}
            </div>
          )}
          {visit.agent && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <User className="h-4 w-4 mr-2" />
              Agent: {visit.agent.prenom} {visit.agent.nom}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.statut)}`}>
            {getStatusLabel(visit.statut)}
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-green-600">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
