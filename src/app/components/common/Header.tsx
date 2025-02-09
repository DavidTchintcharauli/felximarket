"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/i18";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { LanguageButton } from "./LanguageButton";
import ThemeToggleButton from "../ThemeToggleButton";
import { Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Header() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLanguageChange = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-500 transition"
          >
            🏠 {t("site_name")}
          </Link>
        </div>
        <button
          className="md:hidden text-gray-700 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className="hidden md:flex space-x-6">
          <Link href="/products">
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              {t("products")}
            </button>
          </Link>
          <Link href="/blogs">
            <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
              {t("blogs")}
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition">
              {t("contact")}
            </button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageButton onClick={handleLanguageChange} />
          <ThemeToggleButton />

          {user ? (
            <>
              <Link href="/cart">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                  {t("cart")}
                </button>
              </Link>
              <Link href="/profile">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                  {t("profile")}
                </button>
              </Link>
              <Link href="/orders">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  {t("orders")}
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                  {t("login")}
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  {t("registration")}
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800 shadow-md py-4 px-6">
          <ul className="space-y-4 text-center">
            <li>
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
              >
                {t("blogs")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
              >
                {t("contact")}
              </Link>
            </li>
            <li className="flex justify-center">
              <LanguageButton onClick={handleLanguageChange} />
            </li>
            <li className="flex justify-center">
              <ThemeToggleButton />
            </li>
            {user ? (
              <>
                <li className="text-gray-700 dark:text-white">{user.email}</li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      )}
    </header>
  );
}
