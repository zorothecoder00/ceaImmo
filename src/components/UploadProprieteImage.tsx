"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { X, Image as ImageIcon } from "lucide-react";

interface PropertyImage {
  id: number;
  url: string;
  ordre: number;
}

interface UploadProprieteImageProps {
  images: PropertyImage[];
  setImages: React.Dispatch<React.SetStateAction<PropertyImage[]>>;
}

export default function UploadProprieteImage({ images, setImages }: UploadProprieteImageProps) {
  const removeImage = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
        <ImageIcon className="mx-auto w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          Ajouter des images
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          5 images maximum • 4 MB par image
        </p>
        
        <UploadButton<OurFileRouter, "proprieteImage">
          endpoint="proprieteImage"
          onClientUploadComplete={(res) => {
            const newImages = res.map((file, index) => ({
              id: Date.now() + index,
              url: file.url,
              ordre: images.length + index
            }));
            setImages(prev => [...prev, ...newImages]);
          }}
          onUploadError={(error) => {
            alert(`Erreur : ${error.message}`);
          }}
          appearance={{
            button: "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium",
            allowedContent: "text-xs text-gray-500"
          }}
        />
      </div>

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              
              {/* Badge d'ordre */}
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {index + 1}
              </div>
              
              {/* Bouton de suppression */}
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-4">
          Aucune image ajoutée pour le moment
        </p>
      )}
    </div>
  );
}