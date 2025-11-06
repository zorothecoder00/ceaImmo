import React from "react";
import Image from "next/image";
import { MapPin, Bed, Square, Eye, Edit, Camera } from "lucide-react";
import { Statut } from '@prisma/client'


export interface PropertyImage {
  id: number;
  url: string;   
  ordre: number;
}
  
export interface Property {
  id: number;  
  nom: string;
  description?: string;
  images?: PropertyImage[];
  statut: Statut;
  createdAt: string;
  geolocalisation?: string;
  nombreChambres?: number;
  surface?: number;
  nombreVu?: number;
  prix?: number;
  categorie?: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (statut: Statut) => {
    switch (statut) {
      case Statut.DISPONIBLE:
        return "bg-green-100 text-green-800";
      case Statut.RESERVE:
        return "bg-orange-100 text-orange-800";
      case Statut.VENDU:
        return "bg-blue-100 text-blue-800";
      case Statut.EN_LOCATION:
        return "bg-purple-100 text-purple-800";
      case Statut.EN_NEGOCIATION:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (statut: Statut) => {
    switch (statut) {
      case Statut.DISPONIBLE:
        return "Disponible";
      case Statut.RESERVE:
        return "Réservé";
      case Statut.VENDU:
        return "Vendu";
      case Statut.EN_LOCATION:
        return "En Location";
      case Statut.EN_NEGOCIATION:
        return "En Négociation";
      default:
        return statut;
    }  
  };

  const daysOnMarket = Math.floor(
    (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const mainImage = property.images?.[0]?.url || "/villapiscine.webp";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative h-48">
        <Image src={mainImage} alt={property.nom} fill className="object-cover" />
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
            property.statut
          )}`}
        >
          {getStatusLabel(property.statut)}
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {daysOnMarket}j
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.nom}</h3>

        {property.geolocalisation && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.geolocalisation}
          </div>   
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          {property.nombreChambres !== undefined && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.nombreChambres}
            </div>
          )}
          {property.surface !== undefined && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.surface}m²
            </div>
          )}
          {property.nombreVu !== undefined && (
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {property.nombreVu}
            </div>
          )}
        </div>

        {property.prix !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {Number(property.prix).toLocaleString("fr-FR")} FCFA
            </span>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {property.categorie && (
          <div className="mt-3 text-xs text-gray-500">{property.categorie}</div>
        )}
      </div>
    </div>
  );
}
