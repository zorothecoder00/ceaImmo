// src/components/PropertyCard.tsx
import React from "react";
import Image from "next/image";

interface PropertyImage {  
  id: number;
  url: string;  
  ordre: number;
}

interface PropertyCardProps {  
  property: {
    id: number;  
    nom: string;
    description?: string;
    images?: PropertyImage[]; // tableau d'images
  };
}  

export default function PropertyCard({ property }: PropertyCardProps) {
  // On prend la première image pour l'affichage principal
  const mainImage =
    property.images?.[0]?.url || '/villapiscine.webp';

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="w-full h-48 relative">  
        <Image
          src={mainImage}
          alt={property.nom}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.nom}</h3>
        <p className="text-gray-600 text-sm mt-1">{property?.description}</p>
      </div>
    </div>
  );
}
