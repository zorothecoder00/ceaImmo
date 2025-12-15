import prisma from "@/lib/prisma";
import { Systeme } from "@prisma/client";

// Convertit tous les BigInt en string pour JSON
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// Types discriminés pour chaque type de notification
type NotificationData =
  | { type: "OFFRE_PROPOSEE"; montant: number | bigint; propriete: string }
  | { type: "OFFRE_ACCEPTEE"; propriete: string }
  | { type: "OFFRE_REFUSEE"; propriete: string }
  | { type: "VISITE_DEMANDEE"; propriete: string }
  | { type: "VISITE_CONFIRMEE"; date: string | Date; propriete: string }
  | { type: "PAIEMENT_INITIE"; montant: number | bigint }
  | { type: "PAIEMENT_FINALISE"; montant: number | bigint };

type NotificationType = NotificationData["type"];

export async function notify({
  type,
  recepteurId,
  emetteurId,
  data,
  lien,
}: {
  type: NotificationType;
  recepteurId: number;
  emetteurId?: number;
  data: Extract<NotificationData, { type: typeof type }>;
  lien?: string;
}) {      
  // Sérialisation pour convertir les BigInt en string
  const safeData = serializeBigInt(data);

  const contenu = buildMessage(type, safeData);

  await prisma.notification.create({
    data: {
      systeme: Systeme.PUSH,
      contenu,
      userId: recepteurId,
      emetteurId,
      lien,
    },
  });  
}

function buildMessage(type: NotificationType, data: NotificationData): string {
  switch (type) {
    case "OFFRE_PROPOSEE": {
      const d = data as Extract<NotificationData, { type: "OFFRE_PROPOSEE" }>;
      return `Nouvelle offre de ${d.montant} FCFA pour "${d.propriete}"`;
    }
    case "OFFRE_ACCEPTEE": {
      const d = data as Extract<NotificationData, { type: "OFFRE_ACCEPTEE" }>;
      return `Votre offre pour "${d.propriete}" a été acceptée`;
    }
    case "OFFRE_REFUSEE": {
      const d = data as Extract<NotificationData, { type: "OFFRE_REFUSEE" }>;
      return `Votre offre pour "${d.propriete}" a été refusée`;
    }
    case "VISITE_DEMANDEE": {
      const d = data as Extract<NotificationData, { type: "VISITE_DEMANDEE" }>;
      return `Nouvelle demande de visite pour "${d.propriete}"`;
    }
    case "VISITE_CONFIRMEE": {
      const d = data as Extract<NotificationData, { type: "VISITE_CONFIRMEE" }>;
      return `Votre visite est confirmée pour le ${d.date}`;
    }
    case "PAIEMENT_INITIE": {
      const d = data as Extract<NotificationData, { type: "PAIEMENT_INITIE" }>;
      return `Paiement initié (${d.montant} FCFA)`;
    }
    case "PAIEMENT_FINALISE": {
      const d = data as Extract<NotificationData, { type: "PAIEMENT_FINALISE" }>;
      return `Paiement de ${d.montant} FCFA effectué avec succès`;
    }
    default:
      return "Nouvelle notification";
  }
}