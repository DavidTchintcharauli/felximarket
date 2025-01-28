"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/i18";
import { useCallback } from "react";
import { LanguageButton } from "./components/common/LanguageButton";
import { languages } from "./config/languages";
import ThemeToggleButton from "./components/ThemeToggleButton";
import { useAuth } from "./context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAuth();

  const handleLanguageChange = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      alert("Signed out successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">{t("greeting")}</h1>
      <div className="flex gap-4">
        {languages.map(({ code, label }) => (
          <LanguageButton
            key={code}
            language={code}
            label={label}
            onClick={handleLanguageChange}
          />
        ))}
      </div>
      <ThemeToggleButton />
      <div className="mt-6">
        {user ? (
          <>
            <h2>Welcome, {user.email}!</h2>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                Sign In
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="px-4 py-2 bg-blue-500 text-white rounded mt-4">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
