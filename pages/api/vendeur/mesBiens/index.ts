// pages/api/mesBiens/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; 
import { Prisma, Role, Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth"; 
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/lib/cloudinary'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join('/tmp/', 'uploads')
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

/* Parse multipart -------------------------------------------------------- */
function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ uploadDir, keepExtensions: true, maxFileSize: 5_242_880 })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  })
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1️⃣ Vérification user connecté
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = Number(session.user.id);

  // Vérifier que l'utilisateur est VENDEUR
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.VENDEUR) {
    return res.status(403).json({ message: "Accès refusé : réservé aux vendeurs" });
  }
    
  // ============ GESTION GET ============
  if (req.method === "GET") {
    // 2️⃣ Gestion des filtres depuis query
    const {
      categorie,
      statut,
      search,
      minPrix,
      maxPrix,
      minSurface,
      maxSurface,     
      minChambres,
      maxChambres,
      latitude,
      longitude,
      radius, // rayon en km
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: Prisma.ProprieteWhereInput = { proprietaireId: userId };

    if (categorie && Object.values(Categorie).includes(categorie as Categorie)) {
      where.categorie = categorie as Categorie;
    }

    if (statut && Object.values(Statut).includes(statut as Statut)) {
      where.statut = statut as Statut;
    }

    if (search) {
      where.OR = [
        { nom: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
        { geolocalisation: { contains: String(search), mode: "insensitive"}},
      ];
    }

    if (minPrix || maxPrix) {
      where.prix = {};
      if (minPrix) where.prix.gte = Number(minPrix);
      if (maxPrix) where.prix.lte = Number(maxPrix);
    }

    if (minSurface || maxSurface) {
      where.surface = {};
      if (minSurface) where.surface.gte = Number(minSurface);
      if (maxSurface) where.surface.lte = Number(maxSurface);
    }

    if (minChambres || maxChambres) {
      where.nombreChambres = {};
      if (minChambres) where.nombreChambres.gte = Number(minChambres);
      if (maxChambres) where.nombreChambres.lte = Number(maxChambres);
    }    

    // 4️⃣ Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // 5️⃣ Gestion du tri dynamique
    const validSortFields = ["prix", "surface", "nombreChambres", "createdAt"];
    const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    try{
      // 6️⃣ Requête principale
      const [biens, total] = await Promise.all([
        prisma.propriete.findMany({
          where: {
            ...where,
          },
          skip,
          take: limitNum,
          orderBy: { [sortField]: sortOrder },
          include: {
            images: true,
            chambres: true,
            avis: { include: { user: true } },
            offres: true,
            reservations: true,
          },
        }),

        prisma.propriete.count({ where }),

      ]);

      // 7️⃣ Réponse
      return res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        sortBy: sortField,
        order: sortOrder,
        data: biens,
      });

    } catch (error) {
      console.error("Erreur API /mesBiens:", error);
      return res.status(500).json({ message: "Erreur interne", error });
    }
  }

  /* --------------------------------------------------------------- POST */
  if(req.method ==='POST'){
    try{
      const { fields, files } = await parseForm(req);

      const nom = Array.isArray(fields.nom) ? fields.nom[0] : fields.nom;
      const description = Array.isArray(fields.description) ? fields.description[0] : (fields.description ?? "");
      const categorie = Array.isArray(fields.categorie) ? fields.categorie[0] : fields.categorie;
      const prix = Number(Array.isArray(fields.prix) ? fields.prix[0] : fields.prix);
      const surface = Number(Array.isArray(fields.surface) ? fields.surface[0] : fields.surface);
      const statut = Array.isArray(fields.statut) ? fields.statut[0] : fields.statut;
      const geolocalisation = Array.isArray(fields.geolocalisation) ? fields.geolocalisation[0] : fields.geolocalisation ?? "";
      const nombreChambres = Number(Array.isArray(fields.nombreChambres) ? fields.nombreChambres[0] : (fields.nombreChambres ?? 1));
      const visiteVirtuelle = Array.isArray(fields.visiteVirtuelle) ? fields.visiteVirtuelle[0] : fields.visiteVirtuelle ?? null;

      if (!nom || !categorie || !statut || !prix || !surface || !geolocalisation) {
        return res.status(400).json({ message: 'Champs requis manquants' })
      }

      if (!Object.values(Categorie).includes(categorie as Categorie))
        return res.status(400).json({ message: "Catégorie invalide" });
      if (!Object.values(Statut).includes(statut as Statut))
        return res.status(400).json({ message: "Statut invalide" });

      /* Upload fichiers sur cloudinary -------------------------------------------------- */
      const uploadedImages: string[] = []
      if(files.images){
        const fileArray = Array.isArray(files.images) ? files.images : [files.images]
        for(const f of fileArray) {
          const file = f as File
          const uploaded = await cloudinary.uploader.upload((file as File).filepath, {
            folder: "cea-immo/biens",
            resource_type: 'auto',
            type: 'upload', // Spécifie le type de livraison (upload = public)
            upload_preset: 'my_unsigned_public'
          })

          uploadedImages.push(uploaded.secure_url);
          fs.unlinkSync(file.filepath);
        }
      }

      // 🧱 Création de la propriété + images liées
      const propriete = await prisma.propriete.create({
        data: {
          nom,
          description,
          categorie: categorie as Categorie,
          prix,
          surface,
          statut: statut as Statut,
          geolocalisation,
          nombreChambres,
          visiteVirtuelle,
          proprietaireId: userId,
          images: {
            create: uploadedImages.map((url, index) => ({ url, ordre: index })),
          },
        },
        include: { images: true },
      });

      return res.status(201).json({ message: "Propriété créée avec succès", data: propriete });

    }catch (error) {
      console.error('Erreur serveur POST /mesBiens:', error)
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' })
}
