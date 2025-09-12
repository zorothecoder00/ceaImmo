import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const config = await prisma.config.findUnique({ where: { id: 1 } })
      return res.status(200).json({
        maintenance: config?.maintenance ?? false,
      })
    }

    if (req.method === "POST") {
      const { maintenance } = req.body

      if (typeof maintenance !== "boolean") {
        return res.status(400).json({ error: "maintenance must be a boolean" })
      }

      const updated = await prisma.config.update({
        where: { id: 1 },
        data: { maintenance },
      })
      return res.status(200).json(updated)
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    console.error("Error in /api/config/maintenance:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
