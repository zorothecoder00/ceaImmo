"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChooseRolePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChoose(role: string) {
    setLoading(true);
    await fetch("/api/chooseRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });  
    setLoading(false);
    router.push("/"); // rediriger vers home
  }

  if (!session) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Choisissez votre rôle</h1>
      <button disabled={loading} onClick={() => handleChoose("ACHETEUR")}>Acheteur</button>
      <button disabled={loading} onClick={() => handleChoose("VENDEUR")}>Vendeur</button>
      <button disabled={loading} onClick={() => handleChoose("AGENT")}>Agent</button>
      <button disabled={loading} onClick={() => handleChoose("ENTREPRISE")}>Entreprise</button>
    </div>
  );
}
