// app/api/paiements/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logPayment } from "@/lib/logger";  
import { StatutTransaction } from "@prisma/client"

// ✅ Type pour le body de la requête
interface ConfirmPaymentRequest {
  transactionId: number;
  idempotencyKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    try {
      const body: ConfirmPaymentRequest = await req.json();
      const { transactionId, idempotencyKey } = body;

      if (!transactionId) {
        return NextResponse.json({ error: "transactionId required" }, { status: 400 });
      }

      // Idempotence: check
      if (idempotencyKey) {
        const existing = await prisma.idempotencyKey.findUnique({
          where: { key: idempotencyKey }
        });
        if (existing && existing.used) {
          return NextResponse.json({ error: "already processed" }, { status: 409 });
        }
        if (!existing) {
          await prisma.idempotencyKey.create({
            data: { key: idempotencyKey, request: { transactionId } }
          });
        }
      }

      const tx = await prisma.transaction.findUnique({
        where: { id: Number(transactionId) }
      });

      if (!tx) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
      }

      if (tx.statut === StatutTransaction.REUSSIE) {
        return NextResponse.json({ ok: true, message: "déjà payé" });
      }

      await prisma.transaction.update({
        where: { id: tx.id },
        data: { statut: StatutTransaction.REUSSIE, paidAt: new Date() }
      });

      if (idempotencyKey) {
        await prisma.idempotencyKey.update({
          where: { key: idempotencyKey },
          data: { used: true, response: { ok: true } }
        });
      }

      await logPayment("info", "Manual confirmation (physique) accepted", { transactionId: tx.id }, tx.id);

      return NextResponse.json({ ok: true });
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return NextResponse.json(
        { error: error.message || "internal" },
        { status: 500 }
      );
    }
  } catch(error) {
    console.error("Outer catch:", error);
  }

}
