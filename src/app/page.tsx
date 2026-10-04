'use client';

import React, { useState } from 'react';
import { Train, Calendar, MapPin, Search, ArrowRight, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RailwayHome() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the URL with query parameters
    const queryString = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`;
    
    // Navigate to the search page
    router.push(`/search${queryString}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Train className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-tight">RailGo</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="hover:text-blue-200 transition">Home</a>
              <a href="#" className="hover:text-blue-200 transition">PNR Status</a>
              <a href="#" className="hover:text-blue-200 transition">Schedules</a>
              <a href="#" className="hover:text-blue-200 transition">Contact Us</a>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-sm">
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section & Search Widget */}
      <header className="relative bg-blue-700 pb-32 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Book Your Train Tickets with Ease
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Fast, secure, and reliable railway reservations across the country. Find the best routes and travel in comfort.
          </p>
        </div>
      </header>

      {/* Search Form (Overlapping the hero) */}
      <main className="grow -mt-24 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="mr-2 h-6 w-6 text-blue-600" />
            Search Trains
          </h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* From Input */}
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-600 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Leaving from..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* To Input */}
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-600 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Going to..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-600 mb-1">Date of Journey</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
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
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Booking</h3>
            <p className="text-gray-600 text-sm">Your data and payments are protected with state-of-the-art encryption.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Instant Refunds</h3>
            <p className="text-gray-600 text-sm">Canceled a ticket? Get your money back directly to your account within hours.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Zero Convenience Fee</h3>
            <p className="text-gray-600 text-sm">Pay only for your ticket. We don't charge any hidden fees or extra taxes on UPI.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <Train className="h-6 w-6" />
              <span className="text-xl font-bold">RailConnect</span>
            </div>
            <p className="text-sm text-gray-400">Making your train journeys comfortable, accessible, and hassle-free since 2026.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Book a Ticket</a></li>
              <li><a href="#" className="hover:text-white transition">Check PNR</a></li>
              <li><a href="#" className="hover:text-white transition">Live Train Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Cancellation Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <p className="text-sm text-gray-400 mb-2">Download our app for exclusive offers.</p>
            {/* App Store Badges Mockup */}
            <div className="flex space-x-2 mt-4">
              <div className="bg-gray-700 rounded px-3 py-1 cursor-pointer hover:bg-gray-600">App Store</div>
              <div className="bg-gray-700 rounded px-3 py-1 cursor-pointer hover:bg-gray-600">Google Play</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} RailConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}