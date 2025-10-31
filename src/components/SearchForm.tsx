'use client'

import { useState } from 'react'

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [geolocalisation, setGeolocalisation] = useState('')
  const [categorie, setCategorie] = useState('')
  const [statut, setStatut] = useState('DISPONIBLE')  
  const [nombreChambres, setNombreChambres] = useState('')
  const [budget, setBudget] = useState('')
  const [surface, setSurface] = useState('')
  const [titre, setTitre] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      // Conversion du budget sélectionné en plage numérique
      const [minPrix, maxPrix] =
        budget === '0-300k€' ? [0, 300000] :
        budget === '300k-500k€' ? [300000, 500000] :
        budget === '500k€+' ? [500000, null] :
        [null, null]

      // Conversion de surface en BigInt-compatible (ici en nombre simple)
      const [minSurface, maxSurface] =
        surface === '0-100m²' ? [0, 100] :
        surface === '100-200m²' ? [100, 200] :
        surface === '200m²+' ? [200, null] :
        [null, null]  

      // Appel API pour sauvegarder la recherche
      const response = await fetch('/api/acheteur/mesRecherchesSauvegardees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: titre || `Recherche ${categorie || ''} ${geolocalisation || ''}`.trim(),
          categorie: categorie || null,
          statut: statut || null,
          geolocalisation: geolocalisation || null,
          nombreChambres: nombreChambres ? Number(nombreChambres) : null,
          minPrix,
          maxPrix,
          minSurface,
          maxSurface,
          triPar: 'prix_desc',
          motsCles: [categorie, geolocalisation, budget, surface].filter(Boolean).join(', ')
        }),
      })

      if (response.ok) {
        alert('✅ Recherche sauvegardée avec succès !')
        setTitre('')
        setCategorie('')
        setStatut('DISPONIBLE')
        setGeolocalisation('')
        setBudget('')
        setSurface('')
        setNombreChambres('')
      } else {
        const err = await response.json()
        alert(`❌ Erreur : ${err.error || 'Impossible de sauvegarder la recherche'}`)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('❌ Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    } 
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-wrap items-center gap-3 bg-white shadow p-4 rounded-lg">
      {/* Titre facultatif */}
      <input
        type="text"
        placeholder="Titre de la recherche (facultatif)"
        className="border border-gray-300 rounded-md px-3 py-2 flex-1"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        disabled={isLoading}
      />

      {/* Localisation */}
      <input
        type="text"
        placeholder="Localisation (ex: Lomé, Adidogomé...)"
        className="border border-gray-300 rounded-md px-3 py-2 flex-1"
        value={geolocalisation}
        onChange={(e) => setGeolocalisation(e.target.value)}
        disabled={isLoading}
      />

      {/* Catégorie */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Catégorie</option>
        <option value="VILLA">Villa</option>
        <option value="MAISON">Maison</option>
        <option value="APPARTEMENT">Appartement</option>
        <option value="HOTEL">Hôtel</option>
        <option value="TERRAIN">Terrain</option>
        <option value="CHANTIER">Chantier</option>
      </select>

      {/* Statut */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2"
        value={statut}
        onChange={(e) => setStatut(e.target.value)}
        disabled={isLoading}
      >
        <option value="DISPONIBLE">Disponible</option>
        <option value="VENDU">Vendu</option>
        <option value="RESERVE">Réservé</option>
        <option value="EN_LOCATION">En location</option>
        <option value="EN_NEGOCIATION">En négociation</option>
      </select>

      {/* Budget */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Budget</option>
        <option value="0-300k€">0-300k€</option>
        <option value="300k-500k€">300k-500k€</option>
        <option value="500k€+">500k€+</option>
      </select>  

      {/* Surface */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2"
        value={surface}
        onChange={(e) => setSurface(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Surface</option>
        <option value="0-100m²">0-100m²</option>
        <option value="100-200m²">100-200m²</option>
        <option value="200m²+">200m²+</option>
      </select>

      {/* Chambres */}
      <input
        type="number"
        placeholder="Chambres"
        className="border border-gray-300 rounded-md px-3 py-2 w-24"
        value={nombreChambres}
        onChange={(e) => setNombreChambres(e.target.value)}
        disabled={isLoading}
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition"
        disabled={isLoading}
      >
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </form>
  )
}
