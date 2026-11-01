"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

export function SignOutButton({ locale = "en" }: { locale?: Locale }) {
  const en = locale === "en";
  const [notice, setNotice] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function signOut() {
    setIsSigningOut(true);
    setNotice("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setNotice(result.error.message ?? (en ? "Could not sign out." : "Não foi possível terminar a sessão."));
        return;
      }
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Could not sign out.", error);
      setNotice(en ? "Could not sign out. Please try again." : "Não foi possível terminar a sessão. Tente novamente.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button className="dashboard-signout" type="button" onClick={signOut} disabled={isSigningOut}>
        {isSigningOut ? (en ? "Signing out…" : "A terminar…") : (en ? "Sign out" : "Terminar sessão")}
      </button>
      {notice && <span role="alert">{notice}</span>}
    </>
  );
}
