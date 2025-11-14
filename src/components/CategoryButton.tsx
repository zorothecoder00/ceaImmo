'use client'

import { Filter, Home, Building, MapPin, Hammer, Hotel } from 'lucide-react';
import { ReactNode, MouseEventHandler } from "react";

const categoryIcons: Record<string, ReactNode> = {
  all: <Filter className="w-4 h-4" />,
  MAISON: <Home className="w-4 h-4" />,
  APPARTEMENT: <Building className="w-4 h-4" />,  
  TERRAIN: <MapPin className="w-4 h-4" />,
  VILLA: <Home className="w-4 h-4" />,
  CHANTIER: <Hammer className="w-4 h-4" />,
  HOTEL: <Hotel className="w-4 h-4" />  
}

// On définit les types possibles pour `type`
type CategoryType = keyof typeof categoryIcons;

interface CategoryButtonProps {
  type: CategoryType;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function CategoryButton({    
  type,
  selected = false,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all
        ${selected
          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
        }
      `}
    >
      {categoryIcons[type]}
      <span>{type === 'all' ? 'Tous' : type}</span>
    </button>
  );
}
