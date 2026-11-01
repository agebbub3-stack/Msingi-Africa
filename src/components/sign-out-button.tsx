"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [notice, setNotice] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function signOut() {
    setIsSigningOut(true);
    setNotice("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setNotice(result.error.message ?? "Não foi possível terminar a sessão.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Could not sign out.", error);
      setNotice("Não foi possível terminar a sessão. Tente novamente.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button className="dashboard-signout" type="button" onClick={signOut} disabled={isSigningOut}>
        {isSigningOut ? "A terminar…" : "Terminar sessão"}
      </button>
      {notice && <span role="alert">{notice}</span>}
    </>
  );
}
