import type { NextApiRequest, NextApiResponse } from "next";
import { getDashboardAdmin, setMaintenanceMode } from "@/lib/getDashboardAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const dashboard = await getDashboardAdmin();

      return res.status(200).json({
        maintenance: dashboard?.maintenance ?? false   // 🔥 jamais undefined
      });
    }

    if (req.method === "POST") {
      const { maintenance } = req.body;

      if (typeof maintenance !== "boolean") {
        return res.status(400).json({
          maintenance: false,
          error: "maintenance must be a boolean"
        });
      }

      const updated = await setMaintenanceMode(maintenance);

      return res.status(200).json({
        maintenance: updated?.maintenance ?? false   // 🔥 garde seulement ça
      });
    }

    return res.status(405).json({ 
      maintenance: false,
      error: "Method not allowed" 
    });

  } catch (error) {
    console.error("Error in /api/admin/maintenance:", error);

    // 🔥 jamais de maintenance activée en cas d’erreur
    return res.status(500).json({
      maintenance: false,
      error: "Internal server error"
    });
  }
}
