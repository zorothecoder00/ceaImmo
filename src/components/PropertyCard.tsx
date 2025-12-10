import React from "react";
import Image from "next/image";
import { MapPin, Bed, Square, Eye, Edit, Camera, Home, Users } from "lucide-react";
import { Statut } from '@prisma/client'

interface Hotel {
  id: number;
  nombreVoyageursMax?: number | null;
  nombreEtoiles?: number | null;
  nombreChambresTotal?: number | null;
  prixParNuitParDefaut?: number | null;
  chambres?: Chambre[]
}

interface Chambre {
  id: number;
  nom?: string;
  description?: string;
  prixParNuit?: number;  // string pour matcher ce que tu envoies
  capacite?: string;
  disponible?: boolean;
}

interface PropertyImage {
  id: number;
  url: string;   
  ordre: number;
}

interface Geolocalisation {
  latitude: number | null;
  longitude: number | null;
}
  
interface Property {
  id: number;  
  nom: string;
  description?: string;
  images?: PropertyImage[];
  statut: Statut;
  createdAt: string;
  geolocalisation?: Geolocalisation | null;
  nombreChambres?: number | null;
  surface?: number;
  nombreVu?: number;
  prix?: number;
  categorie?: string;
  nombreEtoiles?: number | null; 
  moyenneAvis?: number | null;
  hotel?: Hotel | null;
  chambres?: Chambre[] | null;
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

  const isHotel = property.hotel !== undefined && property.hotel !== null;

  const prixMinChambre = isHotel
    ? property?.chambres?.length
        ? Math.min(...property.chambres.map(c => Number(c.prixParNuit)))
        : property?.hotel?.prixParNuitParDefaut ?? null
    : null;

  const mainImage = property.images?.[0]?.url || "/villapiscine.webp";

  console.log(JSON.stringify(property, null, 2));


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
            <a
              href={`https://www.google.com/maps?q=${property.geolocalisation.latitude},${property.geolocalisation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >   
              Voir sur Google Maps
            </a>
          </div>
        )}
       
        {property.nombreEtoiles ? (
          <div className="flex items-center text-yellow-500 text-sm mb-3">
            {"★".repeat(property.nombreEtoiles)}
          </div>
        ) : null}

        {property.moyenneAvis ? (
          <div className="text-sm text-gray-700 mb-2">
            ⭐ {property.moyenneAvis.toFixed(1)} / 5
          </div>
        ) : null}

        {/* 🔵 INFOS SPÉCIFIQUES AUX HÔTELS - VERSION AMÉLIORÉE */}
        {isHotel && property.hotel && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
            <div className="space-y-3">
              {property.hotel.nombreChambresTotal !== undefined && (
                <div className="flex items-center text-gray-700">
                  <div className="bg-white rounded-lg p-2 mr-3 shadow-sm">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Chambres totales</div>
                    <div className="font-semibold text-gray-900">{property.hotel.nombreChambresTotal} chambres</div>
                  </div>
                </div>
              )}

              {property.hotel.nombreVoyageursMax !== undefined && (
                <div className="flex items-center text-gray-700">
                  <div className="bg-white rounded-lg p-2 mr-3 shadow-sm">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Capacité maximale</div>
                    <div className="font-semibold text-gray-900">{property.hotel.nombreVoyageursMax} voyageurs</div>
                  </div>
                </div>
              )}

              {prixMinChambre !== null && (
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">À partir de</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {Number(prixMinChambre).toLocaleString("fr-FR")} <span className="text-sm font-normal text-gray-600">FCFA/nuit</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          {property.nombreChambres !== undefined && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.nombreChambres  ?? 'N/A'}
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
