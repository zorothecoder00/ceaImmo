import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getAuthSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { role } = req.body;

  await prisma.user.update({
    where: { email: session.user.email! },
    data: { role },
  });

  return res.status(200).json({ message: "Role updated" });
}
