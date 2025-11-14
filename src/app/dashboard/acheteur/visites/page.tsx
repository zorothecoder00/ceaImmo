'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { VisiteStatut } from '@prisma/client'

interface Proprietaire {
  id: number
  prenom: string
  nom: string
}

interface Propriete {
  id: number 
  nom: string
  prix: number
  surface: number 
  geolocalisation: string 
  nombreChambres: number
  proprietaire?: Proprietaire
}

interface Visite {
  id: number
  date: string // format ISO (ex: "2025-10-25T15:30:00Z")
  statut: VisiteStatut
  propriete?: Propriete
}

type FilterType = 'all' | 'today' | 'week' | 'month';

const MesVisites = () => {
  const [visites, setVisites] = useState<Visite[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)

  // 🔄 Récupération des visites depuis l’API
  useEffect(() => {
    const fetchVisites = async () => {
      try {
        const res = await fetch('/api/acheteur/mesVisites')
        if (!res.ok) throw new Error('Erreur API')
        const data = await res.json()
        setVisites(data.data)
      } catch (error) {
        console.error('Erreur lors du chargement des visites :', error)
        setVisites([]) // état vide si erreur
      } finally {
        setLoading(false)  
      }
    }

    fetchVisites()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 🧮 Calcul du temps restant avant la visite
  const getTimeRemaining = (date: string): { text: string; className: string } => {
    const visitDate = new Date(date)
    const diff = visitDate.getTime() - currentTime.getTime()

    if (diff < 0) return { text: 'Passée', className: 'bg-gray-100 text-gray-600' }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 2) return { text: `Dans ${hours}h`, className: 'bg-red-100 text-red-800' }
    if (hours < 24) return { text: `Dans ${hours}h`, className: 'bg-green-100 text-green-800' }
    if (days === 1) return { text: 'Demain', className: 'bg-blue-100 text-blue-800' }

    return { text: `Dans ${days}j`, className: 'bg-blue-100 text-blue-800' }
  }

  // 🗓️ Formatage de date
  const formatDate = (date: string): string => {
    const d = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
    if (d.toDateString() === tomorrow.toDateString()) return 'Demain'
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }  

  // 🔍 Filtrage
  const filteredVisites = visites.filter(v => {
    const date = new Date(v.date)
    if (activeFilter === 'today') return date.toDateString() === currentTime.toDateString()
    if (activeFilter === 'week') {
      const in7Days = new Date(currentTime)
      in7Days.setDate(currentTime.getDate() + 7)
      return date >= currentTime && date <= in7Days
    }
    if (activeFilter === 'month') {
      const in1Month = new Date(currentTime)
      in1Month.setMonth(currentTime.getMonth() + 1)
      return date >= currentTime && date <= in1Month
    }
    return true
  })

  // ⏱️ Catégories logiques
  const urgentVisites = filteredVisites.filter(v => {
    const diff = new Date(v.date).getTime() - currentTime.getTime()
    const hours = diff / (1000 * 60 * 60)
    return hours > 0 && hours < 2
  })
  const todayVisites = filteredVisites.filter(v =>
    new Date(v.date).toDateString() === currentTime.toDateString()
  )
  const upcomingVisites = filteredVisites.filter(
    v => new Date(v.date).getTime() > currentTime.getTime() + 24 * 60 * 60 * 1000
  )

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
  ]

  const hasAnyVisite =
      urgentVisites.length > 0 ||
      todayVisites.length > 0 ||
      upcomingVisites.length > 0
    
    // 🧱 Carte de visite
  const VisitCard = ({ visite }: { visite: Visite }) => {
    const timeRemaining = getTimeRemaining(visite.date)
   
    return (
      <div className="rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🏠{visite.propriete?.nom ?? 'Propriété inconnue'}
            </h3>
            <p className="text-gray-600 text-sm mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {visite.propriete?.geolocalisation ?? 'Adresse non spécifiée'}
            </p>
            <div className="text-sm text-gray-600">
               🛏️{visite.propriete?.nombreChambres ?? 0 } chambres — 📐{visite.propriete?.surface ?? 0} m²
            </div>
            <div className="text-lg font-bold text-green-600">
              {visite.propriete?.prix
                ? `${visite.propriete.prix.toLocaleString()} €`
                : 'Prix non défini'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-semibold text-gray-900">
              {formatDate(visite.date)}
            </div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(visite.date).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${timeRemaining.className}`}
            >
              {timeRemaining.text}
            </span>
          </div>
        </div>
        {/* Bas de carte */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {/* Propriétaire */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {visite.propriete?.proprietaire?.prenom
              ? visite.propriete.proprietaire?.prenom.charAt(0)
              : '?'}
            </div>
            <span className="text-sm text-gray-600">
              {visite.propriete?.proprietaire
                ? `${visite.propriete.proprietaire.prenom} ${visite.propriete.proprietaire.nom}`
                : 'Propriétaire inconnu'}
            </span>
          </div>

          {/* Boutons actions */}
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Confirmer
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Reporter
            </button>
            <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 🖥️ Rendu principal
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
            + Nouvelle recherche
          </button>
        </div>
        <nav className="px-6">
          <a href="#" className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100">
            <Calendar className="w-5 h-5 mr-3" />
            Mes visites
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes Visites</h1>
        <p className="text-gray-600 mb-6">Gérez vos rendez-vous de visites immobilières</p>

        {/* Filtres */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 ${
                activeFilter === f.key
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Chargement */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Chargement des visites...</div>
        ) : !hasAnyVisite ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune visite planifiée</h3>
            <p className="text-gray-600">Commencez par rechercher des biens qui vous intéressent.</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Commencer une recherche
            </button>
          </div>
        ) : (
          <>
            {urgentVisites.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🚨 Visites urgentes</h2>
                <div className="space-y-4 mb-8">
                  {urgentVisites.map(v => (
                    <VisitCard key={v.id} visite={v} />
                  ))}
                </div>
              </>
            )}
            {todayVisites.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Aujourd’hui</h2>
                <div className="space-y-4 mb-8">
                  {todayVisites.map(v => (
                    <VisitCard key={v.id} visite={v} />
                  ))}
                </div>
              </>
            )}
            {upcomingVisites.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🗓️ À venir</h2>
                <div className="space-y-4">
                  {upcomingVisites.map(v => (
                    <VisitCard key={v.id} visite={v} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
};

export default MesVisites;