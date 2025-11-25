'use client'

import React, { useState } from 'react';
import { User, Lock, Bell, Eye, Palette, Globe, Clock, Save, Camera } from 'lucide-react';
import Link from 'next/link'

export default function BuyerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [theme, setTheme] = useState('clair');
  const [language, setLanguage] = useState('fr');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,  
    promotions: false
  });
  const [userData, setUserData] = useState({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '+228 90 12 34 56',
    adresse: 'Lomé, Togo'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'confidentialite', label: 'Confidentialité', icon: Eye },
    { id: 'apparence', label: 'Apparence', icon: Palette },
    { id: 'langue', label: 'Langue', icon: Globe },
    { id: 'historique', label: 'Historique', icon: Clock }
  ];

  const historyItems = [
    { date: '2025-10-02', action: 'Achat effectué', detail: 'iPhone 13 Pro' },
    { date: '2025-10-01', action: 'Message envoyé', detail: 'À vendeur_123' },
    { date: '2025-09-30', action: 'Profil modifié', detail: 'Photo de profil mise à jour' },
    { date: '2025-09-28', action: 'Recherche', detail: 'Laptops gaming' }
  ];

  const handleSaveProfile = () => {
    alert('Profil mis à jour avec succès !');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    alert('Mot de passe modifié avec succès !');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Informations personnelles</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Camera className="w-4 h-4" />
                <span>Changer la photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={userData.prenom}
                  onChange={(e) => setUserData({...userData, prenom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={userData.nom}
                  onChange={(e) => setUserData({...userData, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={userData.telephone}
                  onChange={(e) => setUserData({...userData, telephone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={userData.adresse}
                  onChange={(e) => setUserData({...userData, adresse: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        );

      case 'securite':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier le mot de passe
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Préférences de notifications</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 capitalize">{key === 'email' ? 'Notifications par email' : key === 'push' ? 'Notifications push' : key === 'messages' ? 'Messages' : 'Promotions'}</span>
                  <button
                    onClick={() => setNotifications({...notifications, [key]: !value})}
                    className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'confidentialite':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Visibilité du profil</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-300 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={profileVisibility === 'public'}
                    onChange={() => setProfileVisibility('public')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Public</div>
                    <div className="text-sm text-gray-600">Tout le monde peut voir votre profil</div>
                  </div>
                </label>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={profileVisibility === 'prive'}
                    onChange={() => setProfileVisibility('prive')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Privé</div>
                    <div className="text-sm text-gray-600">Seuls vos contacts peuvent voir votre profil</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'apparence':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Thème de l&apos;application</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('clair')}
                className={`p-6 border-2 rounded-lg transition-all ${theme === 'clair' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                <div className="w-full h-24 bg-white border border-gray-300 rounded mb-3"></div>
                <div className="font-medium text-gray-800">Mode Clair</div>
              </button>
              <button
                onClick={() => setTheme('sombre')}
                className={`p-6 border-2 rounded-lg transition-all ${theme === 'sombre' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                <div className="w-full h-24 bg-gray-900 border border-gray-700 rounded mb-3"></div>
                <div className="font-medium text-gray-800">Mode Sombre</div>
              </button>
            </div>
          </div>
        );

      case 'langue':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Langue de l&apos;application</h2>
            <div className="space-y-3">
              {['fr', 'en', 'es'].map((lang) => (
                <div key={lang} className="p-4 border border-gray-300 rounded-lg">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={language === lang}
                      onChange={() => setLanguage(lang)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-800">
                      {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'Español'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'historique':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Historique des activités</h2>
            <div className="space-y-3">
              {historyItems.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{item.action}</div>
                      <div className="text-sm text-gray-600">{item.detail}</div>
                    </div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Bouton retour dashboard */}
        <Link
          href="/dashboard/acheteur"
          className="inline-block mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          ← Retour au dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres - Acheteur</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}