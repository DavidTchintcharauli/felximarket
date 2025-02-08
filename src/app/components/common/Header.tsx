"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/i18";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { LanguageButton } from "./LanguageButton";
import { languages } from "../../config/languages";
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
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 transition duration-300"
          >
            🏠 {t("site_name")}
          </Link>
        </div>
        <button
          className="md:hidden text-gray-800 dark:text-white hover:text-blue-600 transition duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className="hidden md:flex space-x-4">
          <Link href="/products">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-lg">
              {t("products")}
            </button>
          </Link>
          <Link href="/addProduct">
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg">
              {t("addProduct")}
            </button>
          </Link>
          <Link href="/blogs">
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md hover:from-purple-600 hover:to-purple-700 transition duration-300 shadow-lg">
              {t("blogs")}
            </button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {languages.map(({ code, label }) => (
            <LanguageButton
              key={code}
              language={code}
              label={label}
              onClick={handleLanguageChange}
            />
          ))}
          <ThemeToggleButton />

          {user ? (
            <>
              <span className="text-gray-800 dark:text-white hidden lg:block">
                {user.email}
              </span>
              <Link href="/cart">
                <button className="relative px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md hover:from-yellow-600 hover:to-yellow-700 transition duration-300 shadow-lg flex items-center gap-2">
                  {t("cart")}
                </button>
              </Link>
              <Link href="/profile">
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md hover:from-pink-600 hover:to-pink-700 transition duration-300 shadow-lg">
                  {t("profile")}
                </button>
              </Link>
              <Link href="/orders">
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md hover:from-indigo-600 hover:to-indigo-700 transition duration-300 shadow-lg">
                  {t("orders")}
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-md hover:from-teal-600 hover:to-teal-700 transition duration-300 shadow-lg">
                  {t("login")}
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-md hover:from-cyan-600 hover:to-cyan-700 transition duration-300 shadow-lg">
                  {t("registration")}
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-700 shadow-lg py-4 px-6">
          <ul className="space-y-4 text-center">
            <li>
              <Link
                href="/products"
                className="text-gray-800 dark:text-white hover:text-blue-600 transition duration-300"
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                href="/addProduct"
                className="text-gray-800 dark:text-white hover:text-green-600 transition duration-300"
              >
                {t("add_product")}
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="text-gray-800 dark:text-white hover:text-purple-600 transition duration-300"
              >
                {t("blogs")}
              </Link>
            </li>
            <li className="flex justify-center gap-4">
              {languages.map(({ code, label }) => (
                <LanguageButton
                  key={code}
                  language={code}
                  label={label}
                  onClick={handleLanguageChange}
                />
              ))}
            </li>
            <li className="flex justify-center">
              <ThemeToggleButton />
            </li>
            {user ? (
              <>
                <li className="text-gray-800 dark:text-white">{user.email}</li>
                <li>
                  <Link href="/cart">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md hover:from-yellow-600 hover:to-yellow-700 transition duration-300 shadow-lg">
                      {t("cart")}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/profile">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md hover:from-pink-600 hover:to-pink-700 transition duration-300 shadow-lg">
                      {t("profile")}
                    </button>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg"
                  >
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-md hover:from-teal-600 hover:to-teal-700 transition duration-300 shadow-lg">
                      {t("login")}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-md hover:from-cyan-600 hover:to-cyan-700 transition duration-300 shadow-lg">
                      {t("registration")}
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}