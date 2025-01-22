"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslation } from "react-i18next";
import i18n from "@/i18";
import { useCallback } from "react";
import { LanguageButton } from "./components/common/LanguageButton";
import { languages } from "./config/languages";

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
          <a href="/api/auth/logout">
            <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </a>
        </>
      ) : (
        <>
          <a href="/api/auth/login?screen_hint=signup">
            <button className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
          </a>
          <a href="/api/auth/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Log In</button>
          </a>
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
