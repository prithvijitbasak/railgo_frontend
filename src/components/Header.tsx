"use client";

import { useCallback, useState } from "react";
import { Menu, TramFront, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoginModalOpen } from "@/redux/slices/uiSlice";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "PNR Status", href: "#" },
  { label: "Schedules", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const loginModalOpen = useAppSelector((state) => state.ui.loginModalOpen);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeLogin = useCallback(
    () => dispatch(setLoginModalOpen(false)),
    [dispatch]
  );

  const handleLoginSuccess = (token: string) => {
    // store the new user token here (cookie / auth slice), then reload SSR data
    router.refresh();
  };

  const openLogin = () => {
    setMenuOpen(false);
    dispatch(setLoginModalOpen(true));
  };

  const authBlock = user ? (
    <span className="text-sm font-medium truncate max-w-[16rem]">
      {user.email}
    </span>
  ) : (
    <button
      type="button"
      onClick={openLogin}
      className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-sm cursor-pointer"
    >
      Log In
    </button>
  );

  return (
    <>
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              aria-label={`${BRAND} home`}
              className="flex items-center space-x-2 hover:opacity-90 transition"
            >
              <TramFront className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {BRAND}
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-blue-200 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center">{authBlock}</div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 -mr-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-blue-600 bg-blue-700"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-blue-600">
              {user ? (
                <span className="block px-3 text-sm font-medium truncate">
                  {user.email}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="w-full bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-sm cursor-pointer"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <LoginModal
        open={loginModalOpen}
        onClose={closeLogin}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
