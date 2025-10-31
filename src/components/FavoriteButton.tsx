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

  const toggleFavori = async () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/favoris/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, proprieteId }),
        })

        const data = await res.json()
        if (data.success) {
          setIsFavorite(data.isFavorite)
        } else {
          console.error('Erreur:', data.error)
        }
      } catch (error) {
        console.error('Erreur réseau:', error)
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
