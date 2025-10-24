'use client'

import React, { useState, useEffect } from 'react';
import { Home, Search, Heart, Calendar, Briefcase, Settings, MapPin, Clock, User } from 'lucide-react';

interface Visit {
  id: number;
  title: string;
  location: string;
  details: string[];
  price: string;
  date: string;   // ex: "2025-09-15"
  time: string;   // ex: "14:30"
  agent: { name: string; avatar: string };
  status: "today" | "tomorrow" | "upcoming" | "later";
  category: "urgent" | "today" | "upcoming";
}

const MesVisites = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const visits = [
    {
      id: 1,
      title: "Appartement Lumineux Centre-ville",
      location: "15 Rue de la République, Lyon 2ème",
      details: ["3 pièces", "2 chambres", "75 m²"],
      price: "320 000 €",
      date: "2025-09-15",
      time: "14:30",
      agent: { name: "Marie Dubois", avatar: "MD" },
      status: "today" as const,
      category: "urgent" as const
    },
    {
      id: 2,
      title: "Studio Moderne Montparnasse",
      location: "8 Rue de Rennes, Paris 14ème",
      details: ["1 pièce", "25 m²", "Métro 2min"],
      price: "1 200 €/mois",
      date: "2025-09-15",
      time: "16:00",
      agent: { name: "Pierre Martin", avatar: "PM" },
      status: "today" as const,
      category: "today" as const
    },
    {
      id: 3,
      title: "Maison avec Jardin",
      location: "23 Avenue des Chênes, Villeurbanne",
      details: ["5 pièces", "4 chambres", "120 m²", "Jardin 200m²"],
      price: "485 000 €",
      date: "2025-09-16",
      time: "10:00",
      agent: { name: "Sophie Laurent", avatar: "SL" },
      status: "tomorrow" as const,
      category: "upcoming" as const
    },
    {
      id: 4,
      title: "Loft Industriel Belleville",
      location: "45 Rue de Belleville, Paris 20ème",
      details: ["2 pièces", "1 chambre", "60 m²", "Loft"],
      price: "2 100 €/mois",
      date: "2025-09-18",
      time: "15:30",
      agent: { name: "Jean Rousseau", avatar: "JR" },
      status: "upcoming" as const,
      category: "upcoming" as const
    },
    {
      id: 5,
      title: "Appartement Haussmannien",
      location: "12 Boulevard Saint-Germain, Paris 5ème",
      details: ["4 pièces", "3 chambres", "95 m²", "Haussmannien"],
      price: "850 000 €",
      date: "2025-09-20",
      time: "11:00",
      agent: { name: "Claire Bernard", avatar: "CB" },
      status: "upcoming" as const,
      category: "upcoming" as const
    },
    {
      id: 6,
      title: "Penthouse Vue Seine",
      location: "7 Quai de Conti, Paris 6ème",
      details: ["6 pièces", "4 chambres", "150 m²", "Terrasse"],
      price: "1 200 000 €",
      date: "2025-09-25",
      time: "14:00",
      agent: { name: "Thomas Moreau", avatar: "TM" },
      status: "later" as const,
      category: "upcoming" as const
    }
  ];

  const getTimeRemaining = (date: string, time: string): { text: string; className: string } => {
  const visitDateTime = new Date(`${date}T${time}`);
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

  const getCardStyle = (category: Visit["category"]): string => {
  switch (category) {
    case "urgent":
      return "border-l-4 border-l-red-500 bg-gradient-to-r from-white to-red-50";
    case "today":
      return "border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50";
    case "upcoming":
      return "border-l-4 border-l-blue-500 bg-white";
    default:
      return "bg-white";
  }
};

  const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain";
  } else {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
};

  const filteredVisits = activeFilter === 'all' 
    ? visits 
    : visits.filter(visit => {
        if (activeFilter === 'today') return visit.status === 'today';
        if (activeFilter === 'week') return ['today', 'tomorrow', 'upcoming'].includes(visit.status);
        if (activeFilter === 'month') return true;
        return visit.status === activeFilter;
      });

  // Group visits by urgency/timing
  const urgentVisits = filteredVisits.filter(visit => visit.category === 'urgent');
  const todayVisits = filteredVisits.filter(visit => visit.category === 'today');
  const upcomingVisits = filteredVisits.filter(visit => visit.category === 'upcoming');

  const VisitCard: React.FC<{ visit: Visit }> = ({ visit }) => {
  const timeRemaining = getTimeRemaining(visit.date, visit.time);
    
    return (
      <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${getCardStyle(visit.category)}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{visit.title}</h3>
            <p className="text-gray-600 text-sm mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {visit.location}
            </p>
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              {visit.details.map((detail, index) => (
                <span key={index}>
                  {index === 0 && '🏠 '}
                  {index === 1 && '🛏️ '}
                  {index === 2 && '📐 '}
                  {index === 3 && (detail.includes('Jardin') ? '🌳 ' : detail.includes('Métro') ? '🚇 ' : detail.includes('Terrasse') ? '🏢 ' : '🏢 ')}
                  {detail}
                </span>
              ))}
            </div>
            <div className="text-lg font-bold text-green-600">{visit.price}</div>
          </div>
          
          <div className="text-right">
            <div className="text-base font-semibold text-gray-900">
              {formatDate(visit.date)}
            </div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {visit.time}
            </div>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${timeRemaining.className}`}>
              {timeRemaining.text}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {visit.agent.avatar}
            </div>
            <span className="text-sm text-gray-600">{visit.agent.name}</span>
          </div>
          
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
    );
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
            <Home className="w-5 h-5 mr-3" />
            Tableau de bord
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Search className="w-5 h-5 mr-3" />
            Rechercher
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Heart className="w-5 h-5 mr-3" />
            Mes favoris
          </a>
          <a href="#" className="flex items-center py-3 text-green-600 font-medium border-b border-gray-100">
            <Calendar className="w-5 h-5 mr-3" />
            Mes visites
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Briefcase className="w-5 h-5 mr-3" />
            Mes offres
          </a>
          <a href="#" className="flex items-center py-3 text-gray-600 border-b border-gray-100 hover:text-green-600 transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mes Visites</h1>
          <p className="text-gray-600">Gérez vos rendez-vous de visites immobilières</p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600 mt-1">Aujourd&apos;hui</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600 mt-1">Cette semaine</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600 mt-1">Ce mois</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600 mt-1">Total planifiées</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'today', label: "Aujourd'hui" },
            { key: 'week', label: 'Cette semaine' },
            { key: 'month', label: 'Ce mois' }
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

        {/* Urgent Visits */}
        {urgentVisits.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              🚨 Visites urgentes (dans les 2h)
            </h2>
            <div className="space-y-4">
              {urgentVisits.map(visit => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          </div>
        )}

        {/* Today's Visits */}
        {todayVisits.length > 0 && (     
          <div className="mb-10">   
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              📅 Visites d&apos;aujourd&apos;hui
            </h2>
            <div className="space-y-4">
              {todayVisits.map(visit => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Visits */}
        {upcomingVisits.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              🗓️ Visites à venir
            </h2>
            <div className="space-y-4">
              {upcomingVisits.map(visit => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          </div>
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