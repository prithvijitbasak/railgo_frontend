"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, TramFront, User, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoginModalOpen } from "@/redux/slices/uiSlice";
import { logout } from "@/redux/slices/authSlice";
import { removeClientTokenCookie } from "@/lib/authClient";
import { deleteServerTokenCookie } from "@/lib/authServer";
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeLogin = useCallback(
    () => dispatch(setLoginModalOpen(false)),
    [dispatch]
  );

  const openLogin = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
    dispatch(setLoginModalOpen(true));
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMenuOpen(false);
    removeClientTokenCookie();
    try {
      await deleteServerTokenCookie();
    } catch {
      // ignore server cookie deletion errors in client transitions
    }
    dispatch(logout());
    router.push("/");
    router.refresh();
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "";

  const authBlock = user ? (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setUserDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-full bg-blue-800/80 hover:bg-blue-800 py-1.5 pl-2 pr-3.5 text-sm font-medium transition cursor-pointer border border-blue-600/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-expanded={userDropdownOpen}
        aria-haspopup="true"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 font-bold text-xs text-white shadow-sm">
          {initials}
        </span>
        <span className="truncate max-w-[10rem]">
          Hi, {user.first_name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-blue-200 transition-transform ${
            userDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {userDropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white py-2 text-slate-800 shadow-xl ring-1 ring-black/5 z-50">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Signed in as
            </p>
            <p className="font-semibold text-slate-900 truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setUserDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition"
            >
              <User className="h-4 w-4 text-slate-500" />
              <span>My Profile</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-blue-800/60 rounded-lg">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-sm text-white">
                      {initials}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-white truncate text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-blue-200 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center w-full bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-sm"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block text-center w-full bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition shadow-sm cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
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
      <LoginModal open={loginModalOpen} onClose={closeLogin} />
    </>
  );
}
