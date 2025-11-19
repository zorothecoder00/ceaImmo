// app/api/paiements/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"  
import { computeHMAC, decryptJSON } from "@/lib/crypto";  
import { logPayment } from "@/lib/logger";
import { notifyFailure } from "@/lib/notify";

// ✅ Types pour le payload webhook
interface WebhookPayload {
  providerTransactionId?: string;
  status: "REUSSIE" | "ECHOUEE" | "EN_COURS";
  fees?: number;
  netAmount?: number;
  reference?: string;
  reason?: string;
  eventId?: string;
}

// ✅ Type pour les métadonnées de transaction
interface TransactionMetadata {
  processedWebhooks?: string[];
  [key: string]: unknown;
} 

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const provider = req.headers.get("x-sim-provider") || "simulated"; // header to indicate source in this simulation
    const sig = req.headers.get("x-sim-signature") || "";

    // Validate signature using HMAC-SHA256 with WEBHOOK_SECRET_SIMULATOR
    const secret = process.env.WEBHOOK_SECRET_SIMULATOR || "";
    const expected = computeHMAC(secret, raw);
    if (!sig || sig !== expected) {
      await logPayment("warn", "Webhook signature invalid", { provider, sig, expected });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(raw);

    // payload example: { providerTransactionId, status: "REUSSIE"|"ECHOUEE", fees?, netAmount?, reference? }
    const { providerTransactionId, status, fees, netAmount, reference, reason } = payload;

    // Find transaction by providerTransactionId or reference
    let tx = null;
    if (providerTransactionId) {
      tx = await prisma.transaction.findFirst({ where: { providerTransactionId: providerTransactionId }});
    }
    if (!tx && reference) {
      tx = await prisma.transaction.findFirst({ where: { reference }});
    }
    if (!tx) {
      await logPayment("error", "Webhook: transaction not found", payload);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Idempotence on webhook updates: use updatedAt/time or a metadata.processedWebhooks array
    const metadata = (tx.metadata as TransactionMetadata) || {};
    const processedWebhooks = metadata.processedWebhooks || [];
    const eventId = payload.eventId ?? `${provider}_${providerTransactionId}_${status}`;

    const alreadyProcessed = processedWebhooks.includes(eventId);
    if (alreadyProcessed) {
      await logPayment("info", "Webhook already processed", payload, tx.id);
      return NextResponse.json({ ok: true });
    }

    // Update transaction according to status
    const updates: Prisma.TransactionUpdateInput = {
      providerTransactionId: providerTransactionId ?? tx.providerTransactionId,
      fees: fees ? BigInt(fees) : tx.fees,
      netAmount: netAmount ? BigInt(netAmount) : tx.netAmount,
      metadata: {
        ...metadata,
        processedWebhooks: [...processedWebhooks, eventId]
      }
    };

    if (status === "REUSSIE") {
      updates.statut = "REUSSIE";
      updates.paidAt = new Date();
    } else if (status === "ECHOUEE") {
      updates.statut = "ECHOUEE";
      updates.failureReason = reason ?? "unknown";

      // send notification (if user email known)
      try {
        if (tx.userId) {
          const user = await prisma.user.findUnique({ where: { id: tx.userId } });
          if (user?.email) {
            await notifyFailure(
              user.email,
              "Paiement échoué",
              `Votre paiement ${tx.reference} a échoué: ${updates.failureReason}`
            );
          }
        }
      } catch (e) {
        console.warn("notifyFailure failed", e);
      }
    } else if (status === "EN_COURS") {
      updates.statut = "EN_COURS";
    }

    await prisma.transaction.update({ where: { id: tx.id }, data: updates });
    await logPayment("info", "Webhook processed", { payload }, tx.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const error = err as Error;
    console.error("webhook error", error);
    return NextResponse.json(
      { error: error.message || "internal" },
      { status: 500 }
    );
  }
}
