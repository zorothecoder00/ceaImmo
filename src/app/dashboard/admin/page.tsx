// pages/dashboard/admin/index.js ou app/dashboard/admin/page.js
'use client'; // Si vous utilisez app directory

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ou 'next/navigation' pour app directory
import Head from 'next/head';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: { total: 0, new: 0, pending: 0 },
    properties: { total: 0, pending: 0, reported: 0 },
    system: { uptime: '0%', dailyViews: '0', growth: '0%' }
  });

  useEffect(() => {
    // Simulation du chargement des statistiques
    // Remplacez par vos vraies API calls
    const loadStats = async () => {
      try {
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        
        // Données simulées pour l'exemple
        setStats({
          users: { total: 1247, new: 23, pending: 5 },
          properties: { total: 856, pending: 12, reported: 3 },
          system: { uptime: '95.2%', dailyViews: '2.4k', growth: '+15%' }
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  const dashboardCards = [
    {
      id: 'users',
      title: 'Gestion des Utilisateurs',
      description: 'Administrer les comptes utilisateurs, gérer les permissions et surveiller l\'activité des membres.',
      icon: '👥',
      href: '/dashboard/admin/utilisateurs',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'hover:border-blue-500',
      textColor: 'text-blue-500',
      stats: [
        { label: 'Utilisateurs', value: stats.users.total },
        { label: 'Nouveaux', value: stats.users.new },
        { label: 'En attente', value: stats.users.pending }
      ]
    },
    {
      id: 'properties',
      title: 'Modération des Propriétés',
      description: 'Valider, modifier ou supprimer les propriétés immobilières, gérer les signalements.',
      icon: '🏠',
      href: '/dashboard/admin/proprietes',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      borderColor: 'hover:border-red-500',
      textColor: 'text-red-500',
      stats: [
        { label: 'Propriétés', value: stats.properties.total },
        { label: 'À valider', value: stats.properties.pending },
        { label: 'Signalées', value: stats.properties.reported }
      ]
    },
    {
      id: 'statistics',
      title: 'Analytics & Statistiques',
      description: 'Consulter les métriques de performance immobilière, analyser les tendances du marché.',
      icon: '📊',
      href: '/dashboard/admin/statistiques',
      bgColor: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      borderColor: 'hover:border-yellow-500',
      textColor: 'text-yellow-500',
      stats: [
        { label: 'Uptime', value: stats.system.uptime },
        { label: 'Vues/jour', value: stats.system.dailyViews },
        { label: 'Croissance', value: stats.system.growth }
      ]
    },
    {
      id: 'settings',
      title: 'Configuration Système',
      description: 'Configurer les paramètres de CEA IMMO, gérer les sauvegardes et la sécurité.',
      icon: '⚙️',
      href: '/dashboard/admin/parametres',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      borderColor: 'hover:border-purple-500',
      textColor: 'text-purple-500',
      stats: [
        { label: 'Stockage', value: '2.1GB' },
        { label: 'Backup', value: 'Auto' },
        { label: 'Sécurité', value: '✓' }
      ]
    }
  ];

  const handleExportData = async () => {
    try {
      // Implémentez votre logique d'export
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cea-immo-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  const handleMaintenance = () => {
    if (confirm('Activer le mode maintenance ? Les utilisateurs ne pourront plus accéder au site.')) {
      // Implémentez votre logique de maintenance
      router.push('/dashboard/admin/parametres?tab=maintenance');
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard Admin - CEA IMMO</title>
        <meta name="description" content="Panneau d'administration CEA IMMO" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-lg rounded-t-3xl shadow-2xl mb-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-t-3xl text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                🏢 CEA IMMO - Dashboard Admin
              </h1>
              <p className="text-lg lg:text-xl text-gray-200">
                Panneau de contrôle pour la gestion de la plateforme immobilière
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
            {dashboardCards.map((card, index) => (
              <Link
                key={card.id}
                href={card.href}
                className="group block transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`bg-white rounded-2xl p-8 shadow-xl border-2 border-transparent transition-all duration-300 ${card.borderColor} group-hover:shadow-2xl relative overflow-hidden`}>
                  {/* Accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${card.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 ${card.bgColor} rounded-full flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    {card.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className={`font-bold text-lg ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/95 backdrop-blur-lg rounded-b-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Actions Rapides
            </h3>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.push('/dashboard/admin/utilisateurs/nouveau')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                👥 + Nouvel Agent
              </button>
              <button
                onClick={handleExportData}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                📊 Rapport Mensuel
              </button>
              <button
                onClick={handleMaintenance}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                🔧 Mode Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;