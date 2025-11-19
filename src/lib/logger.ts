// lib/logger.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
 
// ✅ Type pour les métadonnées de log
type LogMetadata = Record<string, unknown> | null | undefined;

export async function logPayment(
  level: string,
  message: string,  
  meta?: LogMetadata,
  transactionId?: number
): Promise<void> {  
  try {
    await prisma.paymentLog.create({
      data: {
        level: level.toUpperCase(),
        message,
        meta: meta as Prisma.JsonValue ?? Prisma.JsonNull,
        transactionId,
      },
    });
  } catch (e) {
    console.error("Failed to write PaymentLog", e);
  }
}