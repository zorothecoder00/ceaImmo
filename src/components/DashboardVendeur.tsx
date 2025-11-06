'use client'

import { useState } from 'react'    
import { motion, AnimatePresence } from 'framer-motion'   
import { 
  Home, Building, Calendar, Settings, Bell, User, Eye, 
  TrendingUp, Euro, X, Plus, Trash2, Loader2,    
  AlertCircle, MapPin, Bed, CheckCircle      
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'  
import { Card } from '@/components/ui/card'
import { Categorie, Statut, OffreStatut, VisiteStatut } from '@prisma/client'
import UploadProprieteImage from '@/components/UploadProprieteImage'
import StatCards from '@/components/StatCard';
import PropertyCard from '@/components/PropertyCard';
import OfferCard from '@/components/OfferCard'   
import VisitCard from '@/components/VisitCard';

export interface User {
  id: number;
  prenom: string;
  nom: string;
  email?: string;
}

interface RecentProperty {
  id: number
  nom: string
  description?: string | null
  categorie: Categorie
  prix: number
  surface: number
  statut: Statut
  nombreChambres: number
  geolocalisation: string
  createdAt: string
  images?: PropertyImage[]
}


interface Offre {
  id: number
  propriete: RecentProperty
  user: { id: number; prenom: string; nom: string } // ajouter l'id
  montant: number | bigint
  statut: OffreStatut
  createdAt?: string  
}
 
interface Visite {  
  id: number   
  propriete: RecentProperty | null  
  date: string | Date
  statut: VisiteStatut
  user?: User | null // ✅ accepte undefined ou null
  agent?: User | null // ✅ accepte undefined ou null
}

interface Chambre {
  nom: string
  description?: string
  prixParNuit: string
  capacite: string
  disponible: boolean
}

interface FormDataProps {
  nom: string
  description?: string
  categorie: Categorie
  prix: string
  surface: string      
  statut: Statut
  geolocalisation: string
  nombreChambres: string
  visiteVirtuelle: string
}

interface PropertyImage {
  id: number
  url: string
  ordre: number
}

interface VendeurDashboardClientProps {
  user: {
    id: string
    prenom: string
    nom: string
  }
  stats: {
    activeProperties: number
    reservedProperties: number
    soldProperties: number
    totalViews: number
    pendingOffers: number
  }
  recentProperties: RecentProperty[]
  offresRecentes: Offre[]
  prochainesVisites: Visite[]
}

export default function VendeurDashboardClient({
  user,
  stats,
  recentProperties,
  offresRecentes,
  prochainesVisites,
}: VendeurDashboardClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [images, setImages] = useState<PropertyImage[]>([])
  const [chambres, setChambres] = useState<Chambre[]>([])

  const [formData, setFormData] = useState<FormDataProps>({
    nom: '',
    description: '',
    categorie: Categorie.VILLA,
    prix: '',
    surface: '',
    statut: Statut.DISPONIBLE,
    geolocalisation: '',
    nombreChambres: '',
    visiteVirtuelle: '',
  })

  // 🔹 Handlers
  const handleChange = (field: keyof FormDataProps, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddNew = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const addChambre = () => {
    setChambres(prev => [
      ...prev,
      { nom: '', description: '', prixParNuit: '', capacite: '', disponible: true },
    ])
  }

  const removeChambre = (index: number) => {
    setChambres(prev => prev.filter((_, i) => i !== index))
  }

  const updateChambre = (index: number, field: keyof Chambre, value: string) => {
    setChambres(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // 🔹 Validation d’étape
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(
          formData.nom &&
          formData.categorie &&
          formData.prix &&
          formData.surface &&
          formData.geolocalisation &&
          formData.nombreChambres
        )
      case 2:
        return images.length > 0
      default:
        return true
    }
  }

  // 🔹 Soumission du formulaire
  const handleSubmit = async () => {
    if (!isStepValid()) return
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const payload = {
        ...formData,
        prix: Number(formData.prix),
        surface: Number(formData.surface),
        nombreChambres: Number(formData.nombreChambres),
        imageUrls: images.map(img => img.url),
        chambres,
      }

      const res = await fetch('/api/vendeur/mesBiens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la création')

      // Réinitialisation
      setFormData({
        nom: '',
        description: '',
        categorie: Categorie.VILLA,
        prix: '',
        surface: '',
        statut: Statut.DISPONIBLE,   
        geolocalisation: '',
        nombreChambres: '',
        visiteVirtuelle: '',
      })
      setImages([])
      setChambres([])
      setShowModal(false)
      window.location.reload()
    } catch (error) {
      console.error('Erreur soumission:', error)
      if (error instanceof Error) {
        setErrorMsg(error.message)
      } else {
        setErrorMsg('Une erreur inconnue est survenue.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = Object.values(Categorie)
  const statuts = Object.values(Statut)


  return (  
    <div className="min-h-screen bg-gray-50">
    {/* Navigation */}
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">     
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">CEA IMMO</h1>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Accueil</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Mes biens</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Offres</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Visites</a>
            </div>
          </div>  

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/vendeur/notifications"
              className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {stats.pendingOffers}
              </span>
            </Link>
            <button className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="text-sm">{user.prenom} {user.nom}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.prenom} {user.nom}</p>
              <p className="text-sm text-gray-600">Vendeur</p>
            </div>
          </div>

          <button
            onClick={handleAddNew}
            className="w-full bg-orange-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6 hover:bg-orange-700 transition-colors"
          >
            + Ajouter un bien
          </button>

          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <Home className="h-5 w-5" />
              <span>Tableau de bord</span>
            </a>
            <a href="/dashboard/vendeur/mesBiens" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <Building className="h-5 w-5" />
              <span>Mes biens</span>
            </a>
            <a href="/dashboard/vendeur/offres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <Euro className="h-5 w-5" />
              <span>Offres reçues</span>
            </a>
            <a href="/dashboard/vendeur/visites" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <Calendar className="h-5 w-5" />
              <span>Visites</span>
            </a>
            <a href="/dashboard/vendeur/statistiques" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <TrendingUp className="h-5 w-5" />
              <span>Statistiques</span>
            </a>
            <a href="/dashboard/vendeur/parametres" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-2">
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bonjour {user.prenom} !</h1>
          <p className="text-gray-600">Suivez les performances de vos biens et gérez vos ventes</p>
        </div>

        {/* 🔹 Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatCards title="Propriétés actives" value={stats.activeProperties} icon={Home} color="green" />
          <StatCards title="Réservées" value={stats.reservedProperties} icon={TrendingUp} color="orange" />
          <StatCards title="Vendues" value={stats.soldProperties} icon={Euro} color="blue" />
          <StatCards title="Total vues" value={stats.totalViews} icon={Eye} color="purple" />
          <StatCards title="Offres en attente" value={stats.pendingOffers} icon={Calendar} color="yellow" />
        </div>   
      
        {/* 🔹 Biens récents */}
        <section className="mt-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Building className="text-orange-500" size={20} />
              Mes dernières propriétés
            </h2>
            <Link
              href="/dashboard/vendeur/mesBiens"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Voir tout →
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Home className="mx-auto w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500">Aucune propriété enregistrée.</p>
              <p className="text-sm text-gray-400 mt-1">
                Cliquez sur “+ Ajouter un bien” pour commencer.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={{
                    id: p.id,
                    nom: p.nom,
                    description: p.description ?? undefined,
                    categorie: p.categorie,
                    prix: p.prix,
                    surface: p.surface,
                    statut: p.statut,
                    nombreChambres: p.nombreChambres,
                    geolocalisation: p.geolocalisation,
                    createdAt: p.createdAt,
                    images: p.images?.map((img) => ({
                      id: img.id,
                      url: img.url,
                      ordre: img.ordre,
                    })) || [],
                  }}
                />
              ))}
            </motion.div>
          )}
        </section>
 
   
        {/* 🔹 Offres récentes + Visites à venir côte à côte */}
        <section className="mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 🟠 Colonne 1 : Offres récentes */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Euro className="text-orange-500" size={20} /> Offres récentes
              </h2>
              {offresRecentes.length === 0 ? (
                <p className="text-gray-500">Aucune offre reçue.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {offresRecentes.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={{
                        ...offer,
                        montant: Number(offer.montant),
                        createdAt: offer.createdAt ?? new Date().toISOString(),
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 🟢 Colonne 2 : Prochaines visites */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Calendar className="text-green-600" size={20} /> Prochaines visites
              </h2>
              {prochainesVisites.length === 0 ? (
                <p className="text-gray-500">Aucune visite planifiée pour le moment.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {prochainesVisites.map((v) => (
                    <VisitCard
                      key={v.id}
                      visit={{
                        id: v.id,
                        date:
                          typeof v.date === "string"
                            ? v.date
                            : v.date.toISOString(),
                        statut: v.statut,
                        propriete: v.propriete
                          ? { id: v.propriete.id, nom: v.propriete.nom }
                          : undefined,
                        user: v.user
                          ? { id: v.user.id, prenom: v.user.prenom, nom: v.user.nom }
                          : undefined,
                        agent: v.agent
                          ? { id: v.agent.id, prenom: v.agent.prenom, nom: v.agent.nom }
                          : undefined,
                      }}
                    />
                  ))}  
                </div>
              )}
            </div>
          </div>
        </section>
   
      </main>
    </div>
    {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Ajouter une propriété</h2>
                    <p className="text-orange-100 text-sm mt-1">
                      Étape {currentStep} sur 3
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-6 flex gap-2">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        step <= currentStep ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                {/* Étape 1: Informations principales */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de la propriété *
                        </label>
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Villa Moderne Lomé"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          value={formData.categorie}
                          onChange={(e) => setFormData({ ...formData, categorie: e.target.value as Categorie })}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>

                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          value={formData.prix}
                          onChange={(e) => setFormData({...formData, prix: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="150000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surface (m²) *
                        </label>
                        <input
                          type="number"
                          value={formData.surface}
                          onChange={(e) => setFormData({...formData, surface: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="350"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={formData.statut}
                          onChange={(e) => setFormData({ ...formData, statut: e.target.value as Statut })}
                        >
                          {statuts.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de chambres *
                        </label>
                        <input
                          type="number"
                          value={formData.nombreChambres}
                          onChange={(e) => setFormData({...formData, nombreChambres: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Géolocalisation *
                      </label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.geolocalisation}
                          onChange={(e) => setFormData({...formData, geolocalisation: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Lomé, Bè"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                        placeholder="Décrivez votre propriété..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lien visite virtuelle (optionnel)
                      </label>
                      <input
                        type="url"
                        value={formData.visiteVirtuelle}
                        onChange={(e) => setFormData({...formData, visiteVirtuelle: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </motion.div>    
                )}

                {/* Étape 2: Images */}
                <UploadProprieteImage images={images} setImages={setImages} />

                {/* Étape 3: Chambres (optionnel) */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Chambres (Optionnel)
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pour les hôtels et locations de courte durée
                        </p>
                      </div>
                      <Button
                        onClick={addChambre}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus size={16} className="mr-1" /> Ajouter
                      </Button>
                    </div>

                    {chambres.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Bed className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">Aucune chambre ajoutée</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Vous pouvez passer cette étape si non applicable
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chambres.map((chambre, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-medium text-gray-900">Chambre {index + 1}</h4>
                              <button
                                onClick={() => removeChambre(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={chambre.nom}
                                onChange={(e) => updateChambre(index, 'nom', e.target.value)}
                                placeholder="Nom de la chambre"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="number"
                                value={chambre.capacite}
                                onChange={(e) => updateChambre(index, 'capacite', e.target.value)}
                                placeholder="Capacité"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="number"
                                value={chambre.prixParNuit}
                                onChange={(e) => updateChambre(index, 'prixParNuit', e.target.value)}
                                placeholder="Prix/nuit (FCFA)"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2"
                              />
                              <textarea
                                value={chambre.description}
                                onChange={(e) => updateChambre(index, 'description', e.target.value)}
                                placeholder="Description"
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2 h-20 resize-none"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setShowModal(false)}
                  >
                    {currentStep === 1 ? 'Annuler' : 'Précédent'}
                  </Button>

                  <div className="flex gap-2">
                    {!isStepValid() && currentStep !== 3 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 mr-4">
                        <AlertCircle size={16} />
                        Veuillez remplir tous les champs requis
                      </div>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepValid()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button  
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={16} />
                            Enregistrement...
                          </>
                        ) : (  
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>  
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}