// pages/visites.tsx ou app/visites/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Eye, Edit3, Trash2, Phone, Mail, Filter } from 'lucide-react';
  
interface Visite {
  id: number;
  dateArrivee: string;
  dateDepart?: string;
  nombreVoyageurs: number;
  type: 'VISITE' | 'LOCATION' | 'ACHAT';
  statut?: 'PLANIFIEE' | 'CONFIRMEE' | 'TERMINEE' | 'ANNULEE';
  propriete: {
    id: number;
    nom: string;
    categorie: string;
    prix: number;
    geolocalisation: string;
    images?: string[];
  };
  chambre?: {
    nom: string;
    prixParNuit: number;
  };
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    photo?: string;
  };
  notes?: string;
}

export default function VisitesRendezVous() {
  const [visites, setVisites] = useState<Visite[]>([]);
  const [vueType, setVueType] = useState<'liste' | 'calendrier'>('liste');
  const [filtreType, setFiltreType] = useState('TOUS');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date().toISOString().split('T')[0]);
  const [showAddVisite, setShowAddVisite] = useState(false);

  // Données de démonstration
  useEffect(() => {
    const demoVisites: Visite[] = [
      {
        id: 1,
        dateArrivee: "2024-02-20T10:00:00Z",
        dateDepart: "2024-02-20T11:00:00Z",
        nombreVoyageurs: 2,
        type: "VISITE",
        statut: "CONFIRMEE",
        propriete: {
          id: 1,
          nom: "Appartement Moderne",
          categorie: "APPARTEMENT",
          prix: 350000,
          geolocalisation: "15 Rue Saint-Paul, Paris",
          images: ["https://via.placeholder.com/300x200"]
        },
        user: {
          id: 1,
          nom: "Martin",
          prenom: "Jean",
          email: "jean.martin@email.com",
          photo: "https://via.placeholder.com/40"
        },
        notes: "Client intéressé par l'achat, budget confirmé"
      },
      {
        id: 2,
        dateArrivee: "2024-02-21T14:30:00Z",
        dateDepart: "2024-02-21T15:30:00Z",
        nombreVoyageurs: 3,
        type: "VISITE",
        statut: "PLANIFIEE",
        propriete: {
          id: 2,
          nom: "Villa de Luxe",
          categorie: "VILLA",
          prix: 750000,
          geolocalisation: "8 Avenue des Pins, Nice",
        },
        user: {
          id: 2,
          nom: "Dubois",
          prenom: "Marie",
          email: "marie.dubois@email.com"
        },
        notes: "Première visite, famille avec enfants"
      },
      {
        id: 3,
        dateArrivee: "2024-02-22T09:00:00Z",
        dateDepart: "2024-02-25T11:00:00Z",
        nombreVoyageurs: 1,
        type: "LOCATION",
        statut: "CONFIRMEE",
        propriete: {
          id: 3,
          nom: "Studio Centre-ville",
          categorie: "APPARTEMENT",
          prix: 800,
          geolocalisation: "12 Rue de la République, Lyon",
        },
        chambre: {
          nom: "Studio Premium",
          prixParNuit: 80
        },
        user: {
          id: 3,
          nom: "Rousseau",
          prenom: "Pierre",
          email: "pierre.rousseau@email.com"
        }
      },
      {
        id: 4,
        dateArrivee: "2024-02-23T16:00:00Z",
        dateDepart: "2024-02-23T17:00:00Z",
        nombreVoyageurs: 2,
        type: "VISITE",
        statut: "TERMINEE",
        propriete: {
          id: 4,
          nom: "Maison Familiale",
          categorie: "MAISON",
          prix: 420000,
          geolocalisation: "25 Rue des Érables, Bordeaux",
        },
        user: {
          id: 4,
          nom: "Leroy",
          prenom: "Sophie",
          email: "sophie.leroy@email.com"
        },
        notes: "Visite très positive, offre possible"
      }
    ];
    setVisites(demoVisites);
  }, []);

  const visitesFiltrees = visites.filter(visite => {
    const correspondType = filtreType === 'TOUS' || visite.type === filtreType;
    const correspondStatut = filtreStatut === 'TOUS' || visite.statut === filtreStatut;
    const correspondDate = vueType === 'liste' || 
      new Date(visite.dateArrivee).toDateString() === new Date(dateSelectionnee).toDateString();
    
    return correspondType && correspondStatut && correspondDate;
  });

  const getStatutColor = (statut?: string) => {
    switch (statut) {
      case 'PLANIFIEE': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'TERMINEE': return 'bg-gray-100 text-gray-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VISITE': return 'bg-purple-100 text-purple-800';
      case 'LOCATION': return 'bg-orange-100 text-orange-800';
      case 'ACHAT': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getDuree = (debut: string, fin?: string) => {
    if (!fin) return '';
    const duree = (new Date(fin).getTime() - new Date(debut).getTime()) / (1000 * 60);
    if (duree < 60) return `${duree}min`;
    if (duree < 1440) return `${Math.round(duree / 60)}h`;
    return `${Math.round(duree / 1440)} jours`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Visites & Rendez-vous</h1>
              <p className="text-gray-600 mt-1">Planifiez et gérez vos rendez-vous clients</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVueType('liste')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    vueType === 'liste' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setVueType('calendrier')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    vueType === 'calendrier' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Calendrier
                </button>
              </div>
              <button
                onClick={() => setShowAddVisite(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nouveau RDV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aujourd&apos;hui</p>
                <p className="text-3xl font-bold text-blue-600">
                  {visites.filter(v => 
                    new Date(v.dateArrivee).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cette Semaine</p>
                <p className="text-3xl font-bold text-green-600">
                  {visites.filter(v => {
                    const dateVisite = new Date(v.dateArrivee);
                    const maintenant = new Date();
                    const debutSemaine = new Date(maintenant.setDate(maintenant.getDate() - maintenant.getDay()));
                    const finSemaine = new Date(debutSemaine.getTime() + 6 * 24 * 60 * 60 * 1000);
                    return dateVisite >= debutSemaine && dateVisite <= finSemaine;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">À Confirmer</p>
                <p className="text-3xl font-bold text-orange-600">
                  {visites.filter(v => v.statut === 'PLANIFIEE').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Terminées</p>
                <p className="text-3xl font-bold text-purple-600">
                  {visites.filter(v => v.statut === 'TERMINEE').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtres:</span>
              </div>
              
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="TOUS">Tous Types</option>
                <option value="VISITE">Visites</option>
                <option value="LOCATION">Locations</option>
                <option value="ACHAT">Achats</option>
              </select>

              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="TOUS">Tous Statuts</option>
                <option value="PLANIFIEE">Planifiées</option>
                <option value="CONFIRMEE">Confirmées</option>
                <option value="TERMINEE">Terminées</option>
                <option value="ANNULEE">Annulées</option>
              </select>
            </div>

            {vueType === 'calendrier' && (
              <input
                type="date"
                value={dateSelectionnee}
                onChange={(e) => setDateSelectionnee(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Liste des Visites */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Rendez-vous ({visitesFiltrees.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {visitesFiltrees.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-600">Aucun rendez-vous ne correspond aux filtres sélectionnés.</p>
              </div>
            ) : (
              visitesFiltrees.map((visite) => {
                const dateTime = formatDateTime(visite.dateArrivee);
                const duree = getDuree(visite.dateArrivee, visite.dateDepart);
                
                return (
                  <div key={visite.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {/* Date et Heure */}
                        <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[80px]">
                          <div className="text-xs text-blue-600 font-medium">{dateTime.date}</div>
                          <div className="text-lg font-bold text-blue-900">{dateTime.time}</div>
                          {duree && <div className="text-xs text-blue-600">{duree}</div>}
                        </div>

                        {/* Informations principales */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{visite.propriete.nom}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(visite.type)}`}>
                              {visite.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(visite.statut)}`}>
                              {visite.statut || 'PLANIFIEE'}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {visite.propriete.geolocalisation}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {visite.nombreVoyageurs} personne{visite.nombreVoyageurs > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">
                                {visite.type === 'LOCATION' && visite.chambre ? 
                                  `${visite.chambre.prixParNuit}€/nuit` : 
                                  `${visite.propriete.prix.toLocaleString('fr-FR')}€`
                                }
                              </span>
                            </div>
                          </div>

                          {/* Client */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {visite.user.photo ? (
                                <img src={visite.user.photo} alt={`${visite.user.prenom} ${visite.user.nom}`} className="h-8 w-8 rounded-full" />
                              ) : (
                                <User className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {visite.user.prenom} {visite.user.nom}
                              </div>
                              <div className="text-sm text-gray-600">{visite.user.email}</div>
                            </div>
                          </div>

                          {/* Notes */}
                          {visite.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                              <strong>Notes:</strong> {visite.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Appeler">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Envoyer un email">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Modifier">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-2">
                          Voir Détails
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal Nouveau Rendez-vous */}
      {showAddVisite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-6">Nouveau Rendez-vous</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations de base */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de rendez-vous</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="VISITE">Visite</option>
                    <option value="LOCATION">Location</option>
                    <option value="ACHAT">Achat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Propriété</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Sélectionner une propriété</option>
                    <option value="1">Appartement Moderne - Paris</option>
                    <option value="2">Villa de Luxe - Nice</option>
                    <option value="3">Studio Centre-ville - Lyon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Sélectionner un client</option>
                    <option value="1">Jean Martin</option>
                    <option value="2">Marie Dubois</option>
                    <option value="3">Pierre Rousseau</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de personnes</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date et heure */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="PLANIFIEE">Planifiée</option>
                    <option value="CONFIRMEE">Confirmée</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
              <textarea
                rows={3}
                placeholder="Informations complémentaires, préférences du client..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddVisite(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Créer le Rendez-vous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}