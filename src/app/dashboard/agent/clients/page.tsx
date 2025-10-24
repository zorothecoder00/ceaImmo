// pages/mes-clients.tsx ou app/mes-clients/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Eye, MessageCircle, UserPlus } from 'lucide-react';    

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photo?: string;
  createdAt: string;
  reservations: {
    id: number;
    type: 'VISITE' | 'LOCATION' | 'ACHAT';
    dateArrivee: string;
    propriete: {
      nom: string;
      categorie: string;
    };
  }[];
  offres: {
    id: number;
    montant: number;
    statut: string;
    propriete: {
      nom: string;
    };
  }[];
}

export default function MesClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtreType, setFiltreType] = useState('TOUS');
  const [recherche, setRecherche] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);

  // Données de démonstration
  useEffect(() => {
    const demoClients: Client[] = [
      {
        id: 1,
        nom: "Martin",
        prenom: "Jean",
        email: "jean.martin@email.com",
        photo: "https://via.placeholder.com/40",
        createdAt: "2024-01-15",
        reservations: [
          {
            id: 1,
            type: "VISITE",
            dateArrivee: "2024-02-20T10:00:00Z",
            propriete: { nom: "Appartement Moderne", categorie: "APPARTEMENT" }
          }
        ],
        offres: [
          {
            id: 1,
            montant: 350000,
            statut: "EN_ATTENTE",
            propriete: { nom: "Villa de Luxe" }
          }
        ]
      },
      {
        id: 2,
        nom: "Dubois",
        prenom: "Marie",
        email: "marie.dubois@email.com",
        createdAt: "2024-01-20",
        reservations: [
          {
            id: 2,
            type: "LOCATION",
            dateArrivee: "2024-02-25T14:00:00Z",
            propriete: { nom: "Studio Centre-ville", categorie: "APPARTEMENT" }
          }
        ],
        offres: []
      },
      {
        id: 3,
        nom: "Rousseau",
        prenom: "Pierre",
        email: "pierre.rousseau@email.com",
        createdAt: "2024-01-25",
        reservations: [],
        offres: [
          {
            id: 2,
            montant: 280000,
            statut: "ACCEPTEE",
            propriete: { nom: "Maison Familiale" }
          }
        ]
      }
    ];
    setClients(demoClients);
  }, []);

  const clientsFiltres = clients.filter(client => {
    const correspondRecherche = 
      client.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      client.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      client.email.toLowerCase().includes(recherche.toLowerCase());

    if (filtreType === 'TOUS') return correspondRecherche;
    if (filtreType === 'ACHETEURS') return correspondRecherche && client.offres.length > 0;
    if (filtreType === 'LOCATAIRES') return correspondRecherche && client.reservations.some(r => r.type === 'LOCATION');
    if (filtreType === 'VISITEURS') return correspondRecherche && client.reservations.some(r => r.type === 'VISITE');
    
    return correspondRecherche;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTEE': return 'bg-green-100 text-green-800';
      case 'REFUSEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Mes Clients</h1>
              <p className="text-gray-600 mt-1">Gérez vos clients et suivez leurs activités</p>
            </div>
            <button
              onClick={() => setShowAddClient(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Nouveau Client
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clients</p>
                <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Acheteurs Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {clients.filter(c => c.offres.length > 0).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Visites Prévues</p>
                <p className="text-3xl font-bold text-orange-600">
                  {clients.reduce((acc, c) => acc + c.reservations.filter(r => r.type === 'VISITE').length, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Offres en Cours</p>
                <p className="text-3xl font-bold text-purple-600">
                  {clients.reduce((acc, c) => acc + c.offres.filter(o => o.statut === 'EN_ATTENTE').length, 0)}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['TOUS', 'ACHETEURS', 'LOCATAIRES', 'VISITEURS'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFiltreType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filtreType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Liste des Clients */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Clients ({clientsFiltres.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {clientsFiltres.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      {client.photo ? (
                        <img src={client.photo} alt={`${client.prenom} ${client.nom}`} className="h-12 w-12 rounded-full" />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.prenom} {client.nom}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Voir Détails
                    </button>
                  </div>
                </div>

                {/* Activités récentes */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.reservations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Réservations</h4>
                      {client.reservations.map((reservation) => (
                        <div key={reservation.id} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{reservation.propriete.nom}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reservation.type === 'VISITE' ? 'bg-blue-100 text-blue-800' :
                              reservation.type === 'LOCATION' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {reservation.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(reservation.dateArrivee).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {client.offres.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Offres</h4>
                      {client.offres.map((offre) => (
                        <div key={offre.id} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{offre.propriete.nom}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(offre.statut)}`}>
                              {offre.statut}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {offre.montant.toLocaleString('fr-FR')} €
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Nouveau Client */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Nouveau Client</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Prénom"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nom"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddClient(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Créer
              </button>  
            </div>
          </div>
        </div>
      )}
    </div>
  );
}