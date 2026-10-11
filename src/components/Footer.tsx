import { TramFront } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 text-white mb-4">
            <TramFront className="h-6 w-6" />
            <span className="text-xl font-bold">{BRAND}</span>
          </div>
          <p className="text-sm text-gray-400">
            Making your train journeys comfortable, accessible, and hassle-free since 2026.
          </p>
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
          <div className="flex space-x-2 mt-4">
            <div className="bg-gray-700 rounded px-3 py-1 cursor-pointer hover:bg-gray-600">App Store</div>
            <div className="bg-gray-700 rounded px-3 py-1 cursor-pointer hover:bg-gray-600">Google Play</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-sm text-center text-gray-400">
        © {new Date().getFullYear()} {BRAND}. All rights reserved.
      </div>
    </footer>
  );
}