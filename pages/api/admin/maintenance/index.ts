// pages/api/admin/maintenance.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDashboardAdmin, setMaintenanceMode } from "@/lib/getDashboardAdmin";
   
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {    
      // Récupère l'état du mode maintenance via getDashboardAdmin
      const dashboard = await getDashboardAdmin();
      return res.status(200).json(dashboard);  
    }        

    if (req.method === "POST") {
      const { maintenance } = req.body;

      if (typeof maintenance !== "boolean") {
        return res.status(400).json({ error: "maintenance must be a boolean" });
      }

      // Met à jour le mode maintenance via setMaintenanceMode
      const updated = await setMaintenanceMode(maintenance);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/config/maintenance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
