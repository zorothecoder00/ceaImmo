import { NextRequest, NextResponse } from "next/server";
import { Mode, StatutTransaction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { encryptJSON } from "@/lib/crypto";    
import { logPayment } from "@/lib/logger";

function genReference(): string {
  return `txn_${Math.random().toString(36).slice(2, 10)}`;
}

// ✅ Types pour la requête et la réponse
interface CreatePaymentRequest {   
  amount: number;
  currency?: string;
  mode: Mode;
  userId?: number;
  phone?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

interface ProviderResponse {
  type: "card" | "mobile" | "cash";
  client_secret?: string;
  next_action?: null;
  status?: string;
  providerToken?: string;
  instruction?: string;
}

interface TransactionResponse {
  transaction: {
    id: number;
    reference: string;
  };
  providerResponse: ProviderResponse;
}

export async function POST(req: NextRequest): Promise<NextResponse<TransactionResponse | { error: string }>> {

  function safeJson(
    input: unknown
  ): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
    if (input === null) return Prisma.JsonNull;

    if (Array.isArray(input)) {
      return input.map(safeJson) as Prisma.InputJsonValue;
    }

    if (typeof input === "object" && input !== null) {
      return Object.fromEntries(
        Object.entries(input).map(([k, v]) => [k, safeJson(v)])
      ) as Prisma.InputJsonValue;
    }

    return input as Prisma.InputJsonValue;
  }

  try {
    const body: CreatePaymentRequest = await req.json();
    const { amount, currency = "XOF", mode, userId, phone, idempotencyKey, metadata } = body;

    if (!amount || !mode) {
      return NextResponse.json({ error: "amount and mode required" }, { status: 400 });
    }

    // Idempotence check
    if (idempotencyKey) {
      const existing = await prisma.idempotencyKey.findUnique({
        where: { key: idempotencyKey }
      });
      if (existing && existing.used) {
        return NextResponse.json(
          { error: "Request already processed (idempotency)" },
          { status: 409 }
        );
      }
      if (!existing) {
        await prisma.idempotencyKey.create({
          data: { key: idempotencyKey, request: safeJson(body) }
        });
      }
    }

    const reference = genReference();

    // Encrypt sensitive metadata (e.g. phone)
    const sensitive = encryptJSON({ phone: phone || null });

    const tx = await prisma.transaction.create({
      data: {
        amount: BigInt(amount),
        currency,
        mode: mode,
        statut: StatutTransaction.EN_ATTENTE,
        reference,
        provider: "simulated",
        providerTransactionId: null,
        metadata: { ...metadata, sensitiveEncrypted: sensitive },
        userId: userId ?? null,
      }
    });

    // Simulate provider response depending on mode
    let providerResponse: ProviderResponse;

    if (mode === Mode.CARTEBANCAIRE) {
      // Simulate a PaymentIntent-like object
      const client_secret = `sim_cs_${Math.random().toString(36).slice(2, 10)}`;
      providerResponse = {
        type: "card",
        client_secret,
        next_action: null,
        status: "requires_payment_method"
      };
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          providerTransactionId: `sim_pi_${tx.id}`,
          metadata: { ...(tx.metadata as Record<string, unknown>), client_secret }
        }
      });
    } else if (mode === Mode.MOOV || mode === Mode.MIXXBYYAS) {
      // Simulate mobile money workflow
      const providerToken = `sim_mobile_${Math.random().toString(36).slice(2, 10)}`;
      providerResponse = {
        type: "mobile",
        providerToken,
        instruction: `Envoyer ${amount} ${currency} depuis le numéro ${phone}`
      };
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { providerTransactionId: providerToken }
      });
    } else if (mode === Mode.WESTERNUNION || mode === Mode.PAYPAL || mode === Mode.STRIPE) {
      // For physical/cash: return instructions
      providerResponse = {
        type: "cash",
        instruction: "Paiement comptant en agence. Utiliser /api/paiements/confirm pour valider."
      };
    } else {   
      return NextResponse.json({ error: "mode inconnu" }, { status: 400 });
    }

    // Mark idempotency used and store response
    if (idempotencyKey) {
      await prisma.idempotencyKey.update({
        where: { key: idempotencyKey },
        data: { used: true, response: safeJson(providerResponse) }
      });
    }

    await logPayment("info", "Initiated transaction", { mode, providerResponse }, tx.id);

    return NextResponse.json(
      { transaction: { id: tx.id, reference }, providerResponse },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}