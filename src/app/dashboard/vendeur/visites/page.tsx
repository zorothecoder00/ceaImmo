'use client'

import React, { useState, useEffect } from 'react';
import { Home, Search, Heart, Calendar, Briefcase, Settings, MapPin, Clock, User } from 'lucide-react';
import { VisiteStatut } from '@prisma/client'


interface Propriete {
  id: number 
  nom: string
  prix: number
  surface: number 
  geolocalisation: string 
  nombreChambres: number
}

interface Acheteur {
  id: number
  prenom: string
  nom: string
}

interface Visit {     
  id: number
  date: string // format ISO (ex: "2025-10-25T15:30:00Z")
  statut: VisiteStatut
  propriete?: Propriete
  user: Acheteur
}

type CategorizedVisit = Visit & { category: 'urgent' | 'today' | 'upcoming' };

const MesVisites = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visits, setVisits] = useState<Visit[]>([])

  // 🔄 Récupération des visites depuis l’API
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch('/api/vendeur/mesVisites')
        if (!res.ok) throw new Error('Erreur API')
        const data = await res.json()
        setVisits(data.data)
      } catch (error) {
        console.error('Erreur lors du chargement des visites :', error)
        setVisits([]) // état vide si erreur
      } 
    }

    fetchVisits()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (dateString: string): { text: string; className: string } => {
    const visitDateTime = new Date(dateString);
    const now = currentTime;
    const diff = visitDateTime.getTime() - now.getTime();

    if (diff < 0) return { text: "Passée", className: "bg-gray-100 text-gray-600" };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 2) {
      return { text: `Dans ${hours}h`, className: "bg-red-100 text-red-800" };
    } else if (hours < 24) {
      return { text: `Dans ${hours}h`, className: "bg-green-100 text-green-800" };
    } else if (days === 1) {
      return { text: "Demain", className: "bg-blue-100 text-blue-800" };
    } else {
      return { text: `Dans ${days}j`, className: "bg-blue-100 text-blue-800" };
    }
  };

  const getCardStyle = (category?: 'urgent' | 'today' | 'upcoming'): string => {
    switch (category) {
      case 'urgent':
        return "border-l-4 border-l-red-500 bg-gradient-to-r from-white to-red-50";
      case 'today':
        return "border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50";
      case 'upcoming':
        return "border-l-4 border-l-blue-500 bg-white";
      default:
        return "bg-white";
    }
  };

  // 🧠 Déterminer la catégorie d'affichage selon la date
  const categorizedVisits: CategorizedVisit[] = visits.map((visit) => {
    const visitDate = new Date(visit.date);
    const diffHours = (visitDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    let category: 'urgent' | 'today' | 'upcoming';

    if (diffHours < 2) category = 'urgent';
    else if (visitDate.toDateString() === currentTime.toDateString()) category = 'today';
    else category = 'upcoming';

    return { ...visit, category };
  });


  // 🧠 Filtrer selon le filtre sélectionné (sans rapport avec statut)
  const filteredVisits = activeFilter === 'all'
    ? categorizedVisits
    : categorizedVisits.filter(v => {
        const date = new Date(v.date);
        const now = new Date();
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);

        if (activeFilter === 'today')
          return date.toDateString() === now.toDateString();
        if (activeFilter === 'week')
          return date >= now && date <= weekFromNow;
        if (activeFilter === 'month')
          return date.getMonth() === now.getMonth();

        return true;
      });

  // 🧠 Regrouper par catégorie (affichage)
  const urgentVisits = filteredVisits.filter(v => v.category === 'urgent');
  const todayVisits = filteredVisits.filter(v => v.category === 'today');
  const upcomingVisits = filteredVisits.filter(v => v.category === 'upcoming');

    
    // 💳 Composant interne pour afficher une carte visite
  const VisitCard: React.FC<{ visit: CategorizedVisit }> = ({ visit }) => {
    const timeRemaining = getTimeRemaining(visit.date);

    return (
      <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${getCardStyle(visit.category)}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏠 {visit.propriete?.nom ?? 'Propriété inconnue'}</h3>
            <p className="text-gray-600 text-sm mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {visit.propriete?.geolocalisation ?? 'Adresse non spécifiée'}
            </p>
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              🛏️ {visit.propriete?.nombreChambres ?? 0} chambres — 📐 {visit.propriete?.surface ?? 0} m²
            </div>
            <div className="text-lg font-bold text-green-600">
              {visit.propriete?.prix
                ? `${visit.propriete.prix.toLocaleString()} €`
                : 'Prix non défini'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-semibold text-gray-900">{formatDate(visit.date)}</div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(visit.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${timeRemaining.className}`}>
              {timeRemaining.text}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {visit.user?.prenom ? visit.user.prenom.charAt(0) : '?'}
            </div>
            <span className="text-sm text-gray-600">
              {visit.user
                ? `${visit.user.prenom} ${visit.user.nom}`
                : 'Acheteur inconnu'}
            </span>
          </div>

          {/* Boutons liés au statut */}
          <div className="flex gap-2">
            {visit.statut === 'DEMANDEE' && (
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Confirmer
              </button>
            )}
            {visit.statut === 'CONFIRMEE' && (
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Reporter
              </button>
            )}
            {visit.statut !== 'ANNULEE' && (
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return "Demain";

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

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
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Home className="w-5 h-5 mr-3" /> Tableau de bord
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Search className="w-5 h-5 mr-3" /> Rechercher
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Heart className="w-5 h-5 mr-3" /> Mes favoris
          </a>
          <a href="#" className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100">
            <Calendar className="w-5 h-5 mr-3" /> Mes visites
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Briefcase className="w-5 h-5 mr-3" /> Mes offres
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Settings className="w-5 h-5 mr-3" /> Paramètres
          </a>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes Visites</h1>
          <p className="text-gray-600">Gérez vos rendez-vous de visites immobilières</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'today', label: "Aujourd'hui" },
            { key: 'week', label: 'Cette semaine' },
            { key: 'month', label: 'Ce mois' },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Groupes */}
        {urgentVisits.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚨 Visites urgentes</h2>
            <div className="space-y-4">
              {urgentVisits.map(visit => <VisitCard key={visit.id} visit={visit} />)}
            </div>
          </section>
        )}

        {todayVisits.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Visites d&apos;aujourd&apos;hui</h2>
            <div className="space-y-4">
              {todayVisits.map(visit => <VisitCard key={visit.id} visit={visit} />)}
            </div>
          </section>
        )}

        {upcomingVisits.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🗓️ Visites à venir</h2>
            <div className="space-y-4">
              {upcomingVisits.map(visit => <VisitCard key={visit.id} visit={visit} />)}
            </div>
          </section>
        )}

        {filteredVisits.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune visite planifiée</h3>
            <p className="text-gray-600">Commencez par rechercher des biens qui vous intéressent.</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Commencer une recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesVisites;