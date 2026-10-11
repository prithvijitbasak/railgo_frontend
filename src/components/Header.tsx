"use client";

import { TramFront } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoginModalOpen } from "@/redux/slices/uiSlice";
import Link from "next/link";

export default function Header() {
  const dispatch = useAppDispatch();
  const isGuest = useAppSelector((state) => state.auth.isGuest);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            aria-label={`${BRAND} home`}
            className="flex items-center space-x-2 hover:opacity-90 transition"
          >
            <TramFront className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">{BRAND}</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <a href="#" className="hover:text-blue-200 transition">
              Home
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              PNR Status
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              Schedules
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              Contact Us
            </a>
          </div>

          <div className="flex space-x-4">
            {isGuest ? (
              <button
                type="button"
                onClick={() => dispatch(setLoginModalOpen(true))}
                className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-sm cursor-pointer"
              >
                Log In
              </button>
            ) : (
              <span className="text-sm font-medium">{user?.email}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
