"use client";

import { useState, useEffect } from 'react';
import { Search, Eye, Calendar, Euro, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface UserType {
  nom: string;
  prenom: string;
  email: string;
}

interface ProprieteType {
  nom: string;
  categorie: string;
  geolocalisation?: string;
}

interface Offre {
  id: number;
  montant: number;
  statut: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "EXPIREE";
  message: string;
  user: UserType;
  propriete: ProprieteType;
  createdAt: string;
  updatedAt: string;
}

interface Reservation {
  id: number;
  dateArrivee: string;
  dateDepart: string;
  nombreVoyageurs: number;
  type: "VISITE" | "LOCATION" | "ACHAT";
  user: UserType;
  propriete: ProprieteType;
  createdAt: string;
}

interface Transaction {
  id: number;
  mode: string;
  user: UserType;
  offre: { montant: number; propriete: { nom: string; categorie: string } };
  createdAt: string;
}

export default function AgentVentesLocationsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("offres");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("TOUS");

  // Données simulées
  useEffect(() => {
    const mockOffres: Offre[] = [
      {
        id: 1,
        montant: 800000,
        statut: "EN_ATTENTE",
        message: "Intéressé par cette propriété, négociation possible",
        user: { nom: "Martin", prenom: "Jean", email: "jean.martin@email.com" },
        propriete: { nom: "Appartement Moderne", categorie: "APPARTEMENT", geolocalisation: "Lomé Centre" },
        createdAt: "2024-01-28T10:00:00Z",
        updatedAt: "2024-01-28T10:00:00Z"
      },
      {
        id: 2,
        montant: 2300000,
        statut: "ACCEPTEE",
        message: "Offre ferme pour achat rapide",
        user: { nom: "Dubois", prenom: "Marie", email: "marie.dubois@email.com" },
        propriete: { nom: "Villa de Luxe", categorie: "VILLA", geolocalisation: "Baguida" },
        createdAt: "2024-01-25T14:30:00Z",
        updatedAt: "2024-01-26T09:15:00Z"
      }
    ];

    const mockReservations: Reservation[] = [
      {
        id: 1,
        dateArrivee: "2024-02-15T00:00:00Z",
        dateDepart: "2024-02-16T00:00:00Z",
        nombreVoyageurs: 2,
        type: "VISITE",
        user: { nom: "Thompson", prenom: "Sarah", email: "sarah.thompson@email.com" },
        propriete: { nom: "Appartement Moderne", categorie: "APPARTEMENT", geolocalisation: "Lomé Centre" },
        createdAt: "2024-01-28T08:00:00Z"
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: 1,
        mode: "STRIPE",
        user: { nom: "Dubois", prenom: "Marie", email: "marie.dubois@email.com" },
        offre: { montant: 2300000, propriete: { nom: "Villa de Luxe", categorie: "VILLA" } },
        createdAt: "2024-01-26T10:00:00Z"
      }
    ];

    setTimeout(() => {
      setOffres(mockOffres);
      setReservations(mockReservations);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatutColor = (statut: Offre["statut"]) => {
    switch(statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTEE': return 'bg-green-100 text-green-800';
      case 'REFUSEE': return 'bg-red-100 text-red-800';
      case 'EXPIREE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: Offre["statut"]) => {
    switch(statut) {
      case 'EN_ATTENTE': return <AlertCircle className="h-4 w-4" />;
      case 'ACCEPTEE': return <CheckCircle className="h-4 w-4" />;
      case 'REFUSEE': return <XCircle className="h-4 w-4" />;
      case 'EXPIREE': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Reservation["type"]) => {
    switch(type) {
      case 'VISITE': return 'bg-blue-100 text-blue-800';
      case 'LOCATION': return 'bg-purple-100 text-purple-800';
      case 'ACHAT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    offresEnAttente: offres.filter(o => o.statut === 'EN_ATTENTE').length,
    offresAcceptees: offres.filter(o => o.statut === 'ACCEPTEE').length,
    reservationsVenir: reservations.filter(r => new Date(r.dateArrivee) > new Date()).length,
    chiffreAffaires: transactions.reduce((sum, t) => sum + t.offre.montant, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ventes et Locations</h1>
            <p className="text-gray-600">Gérez vos offres, réservations et transactions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offres en attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offresEnAttente}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offres acceptées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offresAcceptees}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Réservations à venir</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reservationsVenir}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">CA ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.chiffreAffaires / 1000).toFixed(0)}k €</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('offres')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'offres'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Offres ({offres.length})
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reservations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Réservations ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions ({transactions.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par client ou propriété..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {activeTab === 'offres' && (
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  <option value="TOUS">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="ACCEPTEE">Acceptée</option>
                  <option value="REFUSEE">Refusée</option>
                  <option value="EXPIREE">Expirée</option>
                </select>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Offres Tab */}
            {activeTab === 'offres' && (
              <div className="space-y-4">
                {offres
                  .filter(offre => {
                    const matchesSearch = 
                      offre.user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      offre.user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      offre.propriete.nom.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatut = filterStatut === 'TOUS' || offre.statut === filterStatut;
                    return matchesSearch && matchesStatut;
                  })
                  .map((offre) => (
                    <div key={offre.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {offre.user.prenom} {offre.user.nom}
                            </h3>
                            <p className="text-sm text-gray-600">{offre.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatutColor(offre.statut)}`}>
                            {getStatutIcon(offre.statut)}
                            {offre.statut.replace('_', ' ')}
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {offre.montant.toLocaleString()} €
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{offre.propriete.nom}</h4>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {offre.propriete.geolocalisation}
                          </div>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-sm text-gray-600 mb-1">Reçue le</p>
                          <p className="text-sm font-medium">{formatDate(offre.createdAt)}</p>
                        </div>
                      </div>

                      {offre.message && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">&ldquo;{offre.message}&rdquo;</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Voir détails
                        </button>
                        {offre.statut === 'EN_ATTENTE' && (
                          <>
                            <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Accepter
                            </button>
                            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                {offres.length === 0 && (
                  <div className="text-center py-12">
                    <Euro className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre</h3>
                    <p className="text-gray-600">Les offres de vos clients apparaîtront ici.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations
                  .filter(reservation => 
                    reservation.user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reservation.user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reservation.propriete.nom.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((reservation) => (
                    <div key={reservation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {reservation.user.prenom} {reservation.user.nom}
                            </h3>
                            <p className="text-sm text-gray-600">{reservation.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(reservation.type)}`}>
                            {reservation.type}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Voyageurs</p>
                            <p className="font-semibold">{reservation.nombreVoyageurs}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{reservation.propriete.nom}</h4>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {reservation.propriete.geolocalisation}
                          </div>  
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Date d&apos;arrivée</p>
                          <p className="text-sm font-medium">{formatDate(reservation.dateArrivee)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Date de départ</p>
                          <p className="text-sm font-medium">{formatDate(reservation.dateDepart)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Voir détails
                        </button>
                        <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                          Contacter le client
                        </button>
                      </div>
                    </div>
                  ))}

                {reservations.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                    <p className="text-gray-600">Les réservations de vos clients apparaîtront ici.</p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {transactions
                  .filter(transaction => 
                    transaction.user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.offre.propriete.nom.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((transaction) => (
                    <div key={transaction.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Euro className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {transaction.user.prenom} {transaction.user.nom}
                            </h3>
                            <p className="text-sm text-gray-600">{transaction.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Mode de paiement</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {transaction.mode}
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {transaction.offre.montant.toLocaleString()} €
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{transaction.offre.propriete.nom}</h4>
                          <p className="text-sm text-gray-600">{transaction.offre.propriete.categorie}</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-sm text-gray-600 mb-1">Transaction effectuée le</p>
                          <p className="text-sm font-medium">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Voir détails
                        </button>
                        <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                          Télécharger reçu
                        </button>
                      </div>
                    </div>
                  ))}

                {transactions.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
                    <p className="text-gray-600">Les transactions complétées apparaîtront ici.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}