'use client'

import React, { useState } from 'react';
import { User, Lock, Bell, Eye, Palette, Clock, Save, Package } from 'lucide-react';

interface Ad {   
  id: number;
  title: string;
  visibility: 'public' | 'private';
  views: number;
}

export default function SellerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [defaultAdVisibility, setDefaultAdVisibility] = useState('public');
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newOrders: true,
    messages: true,
    reviews: true,
    lowStock: true
  });

  const [userData, setUserData] = useState({
    name: 'Marie Koffi',
    email: 'marie.koffi@email.com',
    phone: '+228 91 00 00 00',
    address: 'Lomé, Maritime',
    businessName: 'Boutique Marie',
    taxNumber: 'TG123456789'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [ads, setAds] = useState<Ad[]>([
    { id: 1, title: 'iPhone 13 Pro', visibility: 'public', views: 245 },
    { id: 2, title: 'Samsung Galaxy S22', visibility: 'public', views: 189 },
    { id: 3, title: 'MacBook Pro M2', visibility: 'private', views: 0 },
    { id: 4, title: 'iPad Air', visibility: 'public', views: 156 }
  ]);

  const historyData = [
    { id: 1, action: 'Nouvelle annonce créée', date: '2025-10-03 14:30', details: 'iPhone 13 Pro' },
    { id: 2, action: 'Annonce modifiée', date: '2025-10-02 10:15', details: 'Samsung Galaxy S22' },
    { id: 3, action: 'Commande reçue', date: '2025-10-01 16:45', details: 'Commande #1234' },
    { id: 4, action: 'Connexion', date: '2025-09-30 09:20', details: 'IP: 196.168.1.1' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'ads', label: 'Mes annonces', icon: Package },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'history', label: 'Historique', icon: Clock }
  ];

  const handleSaveProfile = () => {
    alert('Profil mis à jour avec succès !');
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    alert('Mot de passe changé avec succès !');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleSaveNotifications = () => {
    alert('Préférences de notifications enregistrées !');
  };

  const toggleAdVisibility = (adId: number) => {
    setAds(ads.map(ad => 
      ad.id === adId 
        ? { ...ad, visibility: ad.visibility === 'public' ? 'private' : 'public' }
        : ad
    ));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Paramètres Vendeur</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`lg:w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Informations personnelles</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom de l&apos;entreprise</label>
                      <input
                        type="text"
                        value={userData.businessName}
                        onChange={(e) => setUserData({ ...userData, businessName: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Adresse</label>
                      <input
                        type="text"
                        value={userData.address}
                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Numéro fiscal</label>
                      <input
                        type="text"
                        value={userData.taxNumber}
                        onChange={(e) => setUserData({ ...userData, taxNumber: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={20} />
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Changer le mot de passe</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Lock size={20} />
                      Changer le mot de passe
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Préférences de notifications</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Canaux de notification</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Notifications par email</span>
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Notifications push</span>
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Notifications SMS</span>
                          <input
                            type="checkbox"
                            checked={notifications.sms}
                            onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Types de notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Nouvelles commandes</span>
                          <input
                            type="checkbox"
                            checked={notifications.newOrders}
                            onChange={(e) => setNotifications({ ...notifications, newOrders: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Messages</span>
                          <input
                            type="checkbox"
                            checked={notifications.messages}
                            onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Avis clients</span>
                          <input
                            type="checkbox"
                            checked={notifications.reviews}
                            onChange={(e) => setNotifications({ ...notifications, reviews: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <span>Alerte stock bas</span>
                          <input
                            type="checkbox"
                            checked={notifications.lowStock}
                            onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveNotifications}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={20} />
                      Enregistrer les préférences
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Confidentialité et visibilité</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Visibilité du profil</label>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="public">Public</option>
                        <option value="private">Privé</option>
                        <option value="verified">Acheteurs vérifiés uniquement</option>
                      </select>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Contrôlez qui peut voir votre profil vendeur
                      </p>
                    </div>
                    <button
                      onClick={() => alert('Paramètres de confidentialité enregistrés !')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={20} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {/* Ads Management Tab */}
              {activeTab === 'ads' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Gestion des annonces</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Visibilité par défaut des nouvelles annonces</label>
                      <select
                        value={defaultAdVisibility}
                        onChange={(e) => setDefaultAdVisibility(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="public">Public</option>
                        <option value="private">Privé</option>
                      </select>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Définir la visibilité par défaut pour vos nouvelles annonces
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Mes annonces actuelles</h3>
                      <div className="space-y-3">
                        {ads.map((ad) => (
                          <div
                            key={ad.id}
                            className={`p-4 rounded-lg border ${
                              theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <h4 className="font-medium">{ad.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {ad.views} vues
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    ad.visibility === 'public'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {ad.visibility === 'public' ? 'Public' : 'Privé'}
                                </span>
                                <button
                                  onClick={() => toggleAdVisibility(ad.id)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Changer
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Paramètres des annonces enregistrés !')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={20} />
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Apparence</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Thème de l&apos;application</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            theme === 'light'
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white border border-gray-300 rounded"></div>
                            <span>Clair</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            theme === 'dark'
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded"></div>
                            <span>Sombre</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Langue</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <button
                      onClick={() => alert('Préférences d\'apparence enregistrées !')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={20} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Historique des activités</h2>
                  <div className="space-y-3">
                    {historyData.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${
                          theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.action}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}