// pages/api/vendeurs/mesBiens/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Role, Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

const uploadDir = path.join("/tmp/", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

async function parseForm(req: NextApiRequest) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5_242_880,
  });
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = Number(session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.VENDEUR) {
    return res.status(403).json({ message: "Accès refusé : réservé aux vendeurs" });
  }

  const { id } = req.query;
  const proprieteId = Number(id);

  if (isNaN(proprieteId)) {
    return res.status(400).json({ message: "ID de propriété invalide" });
  }

  // 🔹 Vérifier que la propriété appartient bien au vendeur
  const propriete = await prisma.propriete.findUnique({
    where: { id: proprieteId },
    select: { proprietaireId: true },
  });

  if (!propriete || propriete.proprietaireId !== userId) {
    return res.status(404).json({ message: "Propriété introuvable ou non autorisée" });
  }

  /* ====================== PATCH : Modifier propriété ====================== */
  if (req.method === "PATCH") {
    try {
      const { fields, files } = await parseForm(req);

      const nom = Array.isArray(fields.nom) ? fields.nom[0] : fields.nom;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description ?? "";
      const categorie = Array.isArray(fields.categorie) ? fields.categorie[0] : fields.categorie;
      const prix = Number(Array.isArray(fields.prix) ? fields.prix[0] : fields.prix);
      const surface = Number(Array.isArray(fields.surface) ? fields.surface[0] : fields.surface);
      const statut = Array.isArray(fields.statut) ? fields.statut[0] : fields.statut;
      const geolocalisation = Array.isArray(fields.geolocalisation) ? fields.geolocalisation[0] : fields.geolocalisation ?? "";
      const nombreChambres = Number(Array.isArray(fields.nombreChambres) ? fields.nombreChambres[0] : fields.nombreChambres ?? 1);
      const visiteVirtuelle = Array.isArray(fields.visiteVirtuelle) ? fields.visiteVirtuelle[0] : fields.visiteVirtuelle ?? null;

      // Vérifications simples
      if (categorie && !Object.values(Categorie).includes(categorie as Categorie))
        return res.status(400).json({ message: "Catégorie invalide" });
      if (statut && !Object.values(Statut).includes(statut as Statut))
        return res.status(400).json({ message: "Statut invalide" });

      // 🖼️ Upload des nouvelles images (si présentes)
      const uploadedImages: string[] = [];
      if (files.images) {
        const fileArray = Array.isArray(files.images) ? files.images : [files.images];
        for (const f of fileArray) {
          const file = f as File;
          const uploaded = await cloudinary.uploader.upload(file.filepath, {
            folder: "cea-immo/biens",
            resource_type: "auto",
            type: "upload",
            upload_preset: "my_unsigned_public",
          });
          uploadedImages.push(uploaded.secure_url);
          fs.unlinkSync(file.filepath);
        }
      }

      // Mise à jour de la propriété
      const updated = await prisma.propriete.update({
        where: { id: proprieteId },
        data: {
          nom: nom || undefined,
          description: description || undefined,
          categorie: categorie ? (categorie as Categorie) : undefined,
          prix: prix || undefined,
          surface: surface || undefined,
          statut: statut ? (statut as Statut) : undefined,
          geolocalisation: geolocalisation || undefined,
          nombreChambres: nombreChambres || undefined,
          visiteVirtuelle: visiteVirtuelle || undefined,
          ...(uploadedImages.length > 0 && {
            images: {
              deleteMany: {}, // on supprime les anciennes
              create: uploadedImages.map((url, index) => ({
                url,
                ordre: index,
              })),
            },
          }),
        },
        include: { images: true },
      });

      return res.status(200).json({
        message: "Propriété mise à jour avec succès",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur PATCH /mesBiens/[id]:", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  /* ====================== DELETE : Supprimer propriété ====================== */
  if (req.method === "DELETE") {
    try {
      // Supprimer d'abord les images de Cloudinary (si besoin)
      const images = await prisma.proprieteImage.findMany({
        where: { proprieteId },
        select: { url: true },
      });

      for (const img of images) {
        const publicId = img.url.split("/").pop()?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`cea-immo/biens/${publicId}`);
          } catch (err) {
            console.error("Erreur suppression Cloudinary:", err);
          }
        }
      }

      await prisma.propriete.delete({
        where: { id: proprieteId },
      });

      return res.status(200).json({ message: "Propriété supprimée avec succès" });
    } catch (error) {
      console.error("Erreur DELETE /mesBiens/[id]:", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
