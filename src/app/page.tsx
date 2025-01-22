"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslation } from "react-i18next";
import i18n from "@/i18";
import { useCallback } from "react";
import { LanguageButton } from "./components/common/LanguageButton";
import { languages } from "./config/languages";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();

  const handleLanguageChange = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <Link  href="/api/auth/logout">
            <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/api/auth/login?screen_hint=signup">
            <button className="px-4 py-2 bg-green-500 text-white rounded">{t("logout")}</button>
          </Link>
          <Link  href="/api/auth/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">{t("login")}</button>
          </Link>
        </>
      )}
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
    </div>
  );
}
