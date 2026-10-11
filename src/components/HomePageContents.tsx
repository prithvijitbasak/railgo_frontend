"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Local-date YYYY-MM-DD (toISOString would use UTC and can be off by a day)
function todayLocal() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export default function HomePageContents() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const fromTrimmed = from.trim();
    const toTrimmed = to.trim();

    if (fromTrimmed.toLowerCase() === toTrimmed.toLowerCase()) {
      setError("Origin and destination can't be the same.");
      return;
    }
    setError("");

    const params = new URLSearchParams({
      from: fromTrimmed,
      to: toTrimmed,
      date,
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-blue-700 pb-32 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Book Your Train Tickets with Ease
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Fast, secure, and reliable railway reservations across the country.
            Find the best routes and travel in comfort.
          </p>
        </div>
      </section>

      {/* Search Form (overlapping the hero) */}
      <main className="grow -mt-24 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="mr-2 h-6 w-6 text-blue-600" />
            Search Trains
          </h2>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {/* From */}
            <div className="flex flex-col relative">
              <label htmlFor="from" className="text-sm font-semibold text-gray-600 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="from"
                  type="text"
                  placeholder="Leaving from..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* To */}
            <div className="flex flex-col relative">
              <label htmlFor="to" className="text-sm font-semibold text-gray-600 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="to"
                  type="text"
                  placeholder="Going to..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col relative">
              <label htmlFor="date" className="text-sm font-semibold text-gray-600 mb-1">
                Date of Journey
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="date"
                  type="date"
                  min={todayLocal()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md"
              >
                Find Trains
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>

            {error && (
              <p role="alert" className="md:col-span-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Booking</h3>
            <p className="text-gray-600 text-sm">
              Your data and payments are protected with state-of-the-art encryption.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Instant Refunds</h3>
            <p className="text-gray-600 text-sm">
              Canceled a ticket? Get your money back directly to your account within hours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Zero Convenience Fee</h3>
            <p className="text-gray-600 text-sm">
              Pay only for your ticket. We don&apos;t charge any hidden fees or extra taxes on UPI.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}