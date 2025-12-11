'use client'

import { useState, useTransition } from 'react'  
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {  
  userId: string
  proprieteId: number
  initialFavorite: boolean
}

export default function FavoriteButton({ userId, proprieteId, initialFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isPending, startTransition] = useTransition()

  const toggleFavori = () => {   
    // On capture la valeur précédente pour rollback si besoin
    const previous = isFavorite

    // ✅ Optimistic update immédiat
    setIsFavorite(prev => !prev)

    startTransition(async () => {
      try {
        const res = await fetch('/api/favoris/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, proprieteId }),
        })

        if (!res.ok) throw new Error("Erreur serveur")

        const data = await res.json()

        if (!data.success) {
          // ❌ Rollback si erreur côté serveur
          setIsFavorite(previous)
          console.error("Erreur toggle favori :", data.error)
        }

      } catch (error) {
        // ❌ Rollback si erreur réseau
        setIsFavorite(previous)
        console.error("Erreur réseau :", error)
      }
    })
  }

  return (
    <button
      onClick={toggleFavori}
      disabled={isPending}
      className={`absolute top-3 right-3 p-2 rounded-full transition ${
        isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
      }`}
    >
      <Heart
        className="h-4 w-4"
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  )
}
