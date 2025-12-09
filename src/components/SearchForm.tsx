'use client'

import { useState } from 'react'
import { Categorie, Statut } from '@prisma/client'
import toast from "react-hot-toast";
import Image from 'next/image';
import { MapPin } from 'lucide-react'

interface Geolocalisation {
  id: number
  proprieteId: number
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
}

interface SearchFilters {
  titre?: string;
  categorie?: Categorie;    
  statut?: Statut;
  geolocalisation?: { latitude: number | null, longitude: number | null };
  radius: number;
  nombreChambres?: number;
  minPrix?: number | null;
  maxPrix?: number | null;
  minSurface?: number | null;
  maxSurface?: number | null;
  triPar?: string;
  motsCles?: string;
}

interface ProprieteImage {
  id: number;
  url: string;
  ordre: number;
}

interface ResultatPropriete {
  id: string;
  nom?: string;
  categorie?: Categorie;
  geolocalisation?: Geolocalisation;
  statut?: Statut;
  prix?: number;
  images?: ProprieteImage[]
}

// Mapping pour affichage lisible
const CATEGORIE_LABELS: Record<Categorie, string> = {
  VILLA: "Villa",
  MAISON: "Maison",
  APPARTEMENT: "Appartement",
  HOTEL: "Hôtel",
  TERRAIN: "Terrain",
  CHANTIER: "Chantier",
}

const STATUT_LABELS: Record<Statut, string> = {
  DISPONIBLE: "Disponible",
  VENDU: "Vendu",
  RESERVE: "Réservé",
  EN_LOCATION: "En location",
  EN_NEGOCIATION: "En négociation",
}

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(false)

  const [geolocalisation, setGeolocalisation] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [address, setAddress] = useState('')
  const [radius, setRadius] = useState(5000)

  const [categorie, setCategorie] = useState<Categorie>(Categorie.VILLA) 
  const [statut, setStatut] = useState<Statut>(Statut.DISPONIBLE)  
  const [nombreChambres, setNombreChambres] = useState('')
  const [budget, setBudget] = useState('')
  const [surface, setSurface] = useState('')   
  const [nom, setNom] = useState('')
  const [resultats, setResultats] = useState<ResultatPropriete[]>([]);

  const [previewTriggered, setPreviewTriggered] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handlePreview = async (filters: SearchFilters) => {
    setIsPreviewLoading(true);

    const res = await fetch("/api/acheteur/mesRecherchesPrevisualisees?preview=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),   
    });
    const data = await res.json();
    setResultats(data.resultats); // afficher les résultats en direct
    setPreviewTriggered(true)

    setIsPreviewLoading(false);
  };

  const handleGeocode = async () => {
    if (!address.trim()) {
      toast.error("Veuillez entrer une adresse.");
      return;
    }

    setIsGeocoding(true);

    // 1️⃣ - Vérifier si l’input est déjà un format "lat, lon"
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const directMatch = address.trim().match(coordRegex);

    if (directMatch) {
      const lat = parseFloat(directMatch[1]);
      const lon = parseFloat(directMatch[3]);

      setGeolocalisation({ latitude: lat, longitude: lon });
      toast.success("📍 Coordonnées détectées et appliquées !");
      setIsGeocoding(false);
      return;
    }

    // 2️⃣ - Vérifier si c’est un lien Google Maps avec coordonnées
    const googleRegex = /@(-?\d+\.\d+),(-?\d+\.\d+),/;
    const urlMatch = address.match(googleRegex);

    if (urlMatch) {
      const lat = parseFloat(urlMatch[1]);
      const lon = parseFloat(urlMatch[2]);

      setGeolocalisation({ latitude: lat, longitude: lon });
      toast.success("📍 Coordonnées extraites du lien Google Maps !");
      setIsGeocoding(false);
      return;
    }

    try {
      // 3️⃣ - Sinon → géocodage via Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        setGeolocalisation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });

        toast.success("📍 Adresse géocodée avec succès !");
      } else {
        toast.error("❌ Aucune localisation trouvée.");
      }
    } catch (error) {
      console.error("Erreur géocodage:", error);
      toast.error("❌ Erreur lors du géocodage.");
    }
    setIsGeocoding(false);
  };


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
          titre: nom || `Recherche ${categorie ? CATEGORIE_LABELS[categorie] : ''} ${geolocalisation || ''}`.trim(),
          categorie: categorie || null,
          statut: statut || null,
          geolocalisation: geolocalisation || null,
          nombreChambres: nombreChambres ? Number(nombreChambres) : null,
          minPrix,
          maxPrix,
          minSurface,
          maxSurface,
          triPar: 'prix_desc',
          motsCles: [categorie ? CATEGORIE_LABELS[categorie] : '', geolocalisation, budget, surface].filter(Boolean).join(', ')
        }),
      })

      if (response.ok) {     
        toast.success('✅ Recherche sauvegardée avec succès !')
        setNom('')
        setCategorie(Categorie.VILLA)
        setStatut(Statut.DISPONIBLE)
        setGeolocalisation({ latitude: null, longitude: null })
        setBudget('')
        setSurface('')
        setNombreChambres('')
      } else {
        const err = await response.json()
        toast.error(`❌ Erreur : ${err.error || 'Impossible de sauvegarder la recherche'}`)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('❌ Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    } 
  }

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-wrap items-center gap-3 bg-white shadow p-4 rounded-lg">
        {/* Titre facultatif */}
        <input
          type="text"
          placeholder="Titre de la recherche (facultatif)"
          className="border border-gray-300 rounded-md px-3 py-2 flex-1"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          disabled={isLoading}
        />
   
        {/* Localisation */}
        <input
        type="text"
        className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5"
        placeholder="Adresse ou lien Google Maps"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="flex flex-col w-32">
        <label className="text-xs text-gray-500 mb-1">Rayon de recherche (m)</label>
        <input
          type="number"
          className="w-32 border-2 border-gray-200 rounded-xl px-3 py-2.5"
          placeholder="Ex: 5000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value) || 0)}
        />
      </div>
      <button
        type="button"
        onClick={handleGeocode}
        disabled={isGeocoding}
        className={`px-4 py-2 rounded-xl transition
          ${isGeocoding
            ? "bg-gray-300 cursor-not-allowed opacity-60"
            : "bg-gray-100 hover:bg-gray-200"
          }`}
      >
        {isGeocoding ? "Géocodage..." : "Géocoder"}
      </button>

        {/* Catégorie */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value as Categorie)}
          disabled={isLoading}
        >
          <option value="">Catégorie</option>
          {Object.entries(CATEGORIE_LABELS)
            .filter(([key]) => key !== 'HOTEL') // on enlève HOTEL
            .map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
          ))}
 
        </select>

        {/* Statut */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={statut}
          onChange={(e) => setStatut(e.target.value as Statut)}
          disabled={isLoading}
        >
          <option value="">Statut</option>
          {Object.entries(STATUT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
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
          className={`px-6 py-2 rounded-md font-medium transition text-white
            ${isLoading
              ? "bg-green-300 cursor-not-allowed opacity-60"
              : "bg-green-600 hover:bg-green-700"
            }`}
          disabled={isLoading}
        >
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </button>

        <button
          type="button"
          onClick={() => handlePreview({
            titre: nom,
            categorie: categorie || undefined,
            statut: statut || undefined,
            geolocalisation: geolocalisation || undefined,
            radius,
            nombreChambres: nombreChambres ? Number(nombreChambres) : undefined,
            minPrix: budget === '0-300k€' ? 0 : budget === '300k-500k€' ? 300000 : 500000,
            maxPrix: budget === '0-300k€' ? 300000 : budget === '300k-500k€' ? 500000 : null,
            minSurface: surface === '0-100m²' ? 0 : surface === '100-200m²' ? 100 : 200,
            maxSurface: surface === '0-100m²' ? 100 : surface === '100-200m²' ? 200 : null
          })}
          disabled={
            isLoading ||
            isPreviewLoading ||
            !geolocalisation.latitude ||
            !geolocalisation.longitude
          }
          className={`px-6 py-2 rounded-md font-medium transition text-white
            ${isPreviewLoading
              ? "bg-blue-300 cursor-not-allowed opacity-60"
              : !geolocalisation.latitude
                ? "bg-blue-300 cursor-not-allowed opacity-60"   // pas encore géocodé
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isPreviewLoading ? "Chargement..." : "Aperçu"}
        </button>

      </form>
      {resultats?.length > 0 && (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Résultats en aperçu :</h3>
        <ul className="space-y-2">
          {resultats.map((r) => (
            <li key={r.id} className="border p-2 rounded flex gap-4 items-center">
              {/* Image principale */}
              {r.images && r.images.length > 0 ? (
                <Image
                  src={r.images[0].url}
                  alt={r.nom || r.categorie || 'Propriété'}
                  width={96}
                  height={96}
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500">
                  Pas d&apos;image
                </div>
              )}

              {/* Infos */}
              <div>
                <h4 className="font-semibold">{r.nom || r.categorie}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  {r.geolocalisation ? (
                    <a
                      href={`https://www.google.com/maps?q=${r.geolocalisation.latitude},${r.geolocalisation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      {r.geolocalisation.latitude.toFixed(5)}, {r.geolocalisation.longitude.toFixed(5)}
                    </a>
                  ) : (
                    'Localisation non disponible'
                  )}
                </div>
                <p>{r.prix ? `${r.prix.toLocaleString()} €` : ''}</p>
                <p>{r.statut}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      )}

      {previewTriggered && resultats && resultats.length === 0 && (
      <div className="mt-6 border border-gray-200 bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center text-gray-600">
        <Image
          src="/icons/empty.png" // OU un emoji / autre icône
          alt="Aucun résultat"
          width={80}
          height={80}
          className="opacity-70 mb-3"
        />
        <h3 className="text-lg font-semibold mb-1">Aucun résultat trouvé</h3>
        <p className="text-sm max-w-sm">
          Aucun bien ne correspond à vos critères actuels.  
          Ajustez peut-être la zone, le statut ou le budget pour élargir la recherche.
        </p>
      </div>
    )}

    </>
  )  
}
