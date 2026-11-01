"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Edit3,
  Home,
  Lock,
  LogOut,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Ticket,
  Train,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoginModalOpen } from "@/redux/slices/uiSlice";
import { logout, updateUser } from "@/redux/slices/authSlice";
import { removeClientTokenCookie } from "@/lib/authClient";
import { deleteServerTokenCookie } from "@/lib/authServer";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SavedPassenger {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  berthPreference: string;
}

interface MockBooking {
  id: string;
  trainName: string;
  trainNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  pnr: string;
  coach: string;
  berth: string;
  travelClass: string;
  status: "CONFIRMED" | "WAITLISTED" | "COMPLETED";
}

export default function ProfileContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState<
    "details" | "bookings" | "passengers" | "security"
  >("details");

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Travel Preferences State
  const [berthPref, setBerthPref] = useState("Lower Berth (LB)");
  const [mealPref, setMealPref] = useState("Vegetarian");

  // Saved Passengers State
  const [passengers, setPassengers] = useState<SavedPassenger[]>([
    {
      id: "1",
      name: user ? `${user.first_name} ${user.last_name}` : "Primary Traveler",
      age: 28,
      gender: "Male",
      berthPreference: "Lower Berth (LB)",
    },
    {
      id: "2",
      name: "Aditi Sharma",
      age: 26,
      gender: "Female",
      berthPreference: "Window / Side Lower",
    },
  ]);

  // Add Passenger Modal State
  const [isAddPassengerOpen, setIsAddPassengerOpen] = useState(false);
  const [newPassengerName, setNewPassengerName] = useState("");
  const [newPassengerAge, setNewPassengerAge] = useState("");
  const [newPassengerGender, setNewPassengerGender] = useState<
    "Male" | "Female" | "Other"
  >("Male");
  const [newPassengerBerth, setNewPassengerBerth] = useState("Lower Berth (LB)");

  // Sample bookings
  const [bookings] = useState<MockBooking[]>([
    {
      id: "bk-1",
      trainName: "Rajdhani Express",
      trainNumber: "12951",
      from: "New Delhi (NDLS)",
      to: "Mumbai Central (MMCT)",
      departureTime: "16:30",
      arrivalTime: "08:35",
      date: "14 Nov, 2026",
      pnr: "245-8910432",
      coach: "B2",
      berth: "34 (Lower)",
      travelClass: "3A",
      status: "CONFIRMED",
    },
    {
      id: "bk-2",
      trainName: "Vande Bharat Express",
      trainNumber: "22436",
      from: "Varanasi Jn (BSB)",
      to: "New Delhi (NDLS)",
      departureTime: "15:00",
      arrivalTime: "23:00",
      date: "28 Oct, 2026",
      pnr: "452-1982736",
      coach: "C4",
      berth: "12 (Window)",
      travelClass: "CC",
      status: "COMPLETED",
    },
  ]);

  const openEditModal = () => {
    if (!user) return;
    setEditFirstName(user.first_name || "");
    setEditLastName(user.last_name || "");
    setEditPhone(user.phone || "");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) {
      toast.error("First and last name are required.");
      return;
    }

    dispatch(
      updateUser({
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        phone: editPhone.trim(),
      })
    );
    setIsEditModalOpen(false);
    toast.success("Profile details updated successfully!");
  };

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassengerName.trim() || !newPassengerAge.trim()) {
      toast.error("Please enter passenger name and age.");
      return;
    }

    const ageNum = parseInt(newPassengerAge, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      toast.error("Please enter a valid age between 1 and 120.");
      return;
    }

    const newPass: SavedPassenger = {
      id: Date.now().toString(),
      name: newPassengerName.trim(),
      age: ageNum,
      gender: newPassengerGender,
      berthPreference: newPassengerBerth,
    };

    setPassengers((prev) => [...prev, newPass]);
    setNewPassengerName("");
    setNewPassengerAge("");
    setIsAddPassengerOpen(false);
    toast.success("Passenger added successfully!");
  };

  const handleDeletePassenger = (id: string) => {
    setPassengers((prev) => prev.filter((p) => p.id !== id));
    toast.info("Passenger removed.");
  };

  const handleLogout = async () => {
    removeClientTokenCookie();
    try {
      await deleteServerTokenCookie();
    } catch {
      // ignore
    }
    dispatch(logout());
    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // If not logged in
  if (!user) {
    return (
      <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="h-16 w-16 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Please log in to view your profile details, manage passenger
            preferences, and check your train ticket bookings.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => dispatch(setLoginModalOpen(true))}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition cursor-pointer"
            >
              Log In to {BRAND}
            </button>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "RG";

  return (
    <main className="flex-1 bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8 font-sans">

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-700 flex items-center gap-1">
            <Home className="h-4 w-4" /> Home
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="text-slate-800 font-medium">My Profile</span>
        </nav>

        {/* Profile Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Train className="h-80 w-80 text-white" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-white/20 shadow-lg flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-white tracking-wider">
                  {initials}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white rounded-full p-1"
                  title="Verified User"
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {user.first_name} {user.last_name}
                  </h1>
                  <span className="bg-blue-600/60 backdrop-blur-md text-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-400/30">
                    Verified Passenger
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-blue-100">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-blue-200" />
                    {user.email}
                  </span>
                  {user.phone ? (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-blue-200" />
                      {user.phone}
                    </span>
                  ) : (
                    <span className="text-blue-200/80 italic">
                      No phone linked
                    </span>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-xs text-blue-200">
                  <span className="bg-white/10 px-2 py-0.5 rounded font-mono">
                    ID: #RG-{user.user_id}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `#RG-${user.user_id}`,
                        "Account User ID"
                      )
                    }
                    className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                    title="Copy User ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-3 self-stretch md:self-auto justify-center">
              <button
                type="button"
                onClick={openEditModal}
                className="flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition border border-red-400/30 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Trips</p>
              <p className="text-xl font-bold text-slate-800">
                {bookings.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Upcoming Trip
              </p>
              <p className="text-xl font-bold text-slate-800">1 Journey</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                RailGo Wallet
              </p>
              <p className="text-xl font-bold text-slate-800">₹0.00</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Saved Travelers
              </p>
              <p className="text-xl font-bold text-slate-800">
                {passengers.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3 space-x-1 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "details"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "bookings"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab("passengers")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "passengers"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Saved Passengers</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "security"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & Preferences</span>
          </button>
        </div>

        {/* TAB 1: Personal Details */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="bg-white rounded-b-2xl rounded-t-none border border-t-0 border-slate-200/80 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    User Details & Account Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official registration details used for your IRCTC train bookings.
                  </p>
                </div>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition self-start sm:self-auto cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Information
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    First Name
                  </span>
                  <p className="text-base font-semibold text-slate-800">
                    {user.first_name || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Last Name
                  </span>
                  <p className="text-base font-semibold text-slate-800">
                    {user.last_name || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-slate-800 truncate">
                      {user.email}
                    </p>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Mobile Phone
                  </span>
                  <p className="text-base font-semibold text-slate-800">
                    {user.phone ? (
                      user.phone
                    ) : (
                      <span className="text-slate-400 text-sm font-normal">
                        Not added yet
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    User Account ID
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-mono font-semibold text-slate-800">
                      #RG-{user.user_id}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `#RG-${user.user_id}`,
                          "Account User ID"
                        )
                      }
                      className="text-slate-400 hover:text-slate-600 transition"
                      title="Copy"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Status
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Preferences Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">
                  Default Travel Preferences
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-filled automatically whenever you book tickets on RailGo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Berth / Seat Preference
                  </label>
                  <select
                    value={berthPref}
                    onChange={(e) => {
                      setBerthPref(e.target.value);
                      toast.success("Berth preference updated.");
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Lower Berth (LB)">Lower Berth (LB)</option>
                    <option value="Middle Berth (MB)">Middle Berth (MB)</option>
                    <option value="Upper Berth (UB)">Upper Berth (UB)</option>
                    <option value="Side Lower (SL)">Side Lower (SL)</option>
                    <option value="Side Upper (SU)">Side Upper (SU)</option>
                    <option value="Window Seat (WS)">Window Seat (WS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Food / Meal Preference
                  </label>
                  <select
                    value={mealPref}
                    onChange={(e) => {
                      setMealPref(e.target.value);
                      toast.success("Meal preference updated.");
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Jain Meal">Jain Meal</option>
                    <option value="No Food">No Food</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bookings */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-b-2xl rounded-t-none border border-t-0 border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Your Train Bookings
                </h3>
                <p className="text-xs text-slate-500">
                  Review upcoming journeys and past ticket history.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <Plus className="h-3.5 w-3.5" /> Book New Ticket
              </Link>
            </div>

            <div className="space-y-4 pt-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition duration-200"
                >
                  <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Train className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="font-bold text-slate-800">
                          {booking.trainName}
                        </span>{" "}
                        <span className="text-xs text-slate-500 font-medium">
                          ({booking.trainNumber})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        PNR: {booking.pnr}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          {booking.departureTime}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {booking.from}
                        </p>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-semibold mb-1">
                          {booking.date}
                        </span>
                        <div className="w-16 sm:w-24 h-0.5 bg-blue-200 relative">
                          <div className="absolute -top-1 right-0 h-2 w-2 rounded-full bg-blue-600"></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          {booking.arrivalTime}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {booking.to}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Class & Seat
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {booking.travelClass} • Coach {booking.coach} • Berth{" "}
                          {booking.berth}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          toast.success(`E-Ticket for PNR ${booking.pnr} downloaded!`)
                        }
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                      >
                        E-Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Saved Passengers */}
        {activeTab === "passengers" && (
          <div className="bg-white rounded-b-2xl rounded-t-none border border-t-0 border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Master Passenger List
                </h3>
                <p className="text-xs text-slate-500">
                  Add traveler details once to autofill bookings in seconds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPassengerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Passenger
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passengers.map((passenger) => (
                <div
                  key={passenger.id}
                  className="rounded-2xl border border-slate-200 p-4 hover:border-blue-300 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {passenger.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {passenger.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {passenger.age} yrs • {passenger.gender} •{" "}
                        {passenger.berthPreference}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePassenger(passenger.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Remove Passenger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Security & Preferences */}
        {activeTab === "security" && (
          <div className="bg-white rounded-b-2xl rounded-t-none border border-t-0 border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Security & Account Settings
              </h3>
              <p className="text-xs text-slate-500">
                Manage your credentials and login sessions securely.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Email OTP Authentication
                    </p>
                    <p className="text-xs text-slate-500">
                      Your account uses passwordless one-time verification sent to{" "}
                      <span className="font-medium text-slate-700">
                        {user.email}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Current Browser Session
                    </p>
                    <p className="text-xs text-slate-500">
                      Token authenticated with 7-day secure rolling cookie.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  Active Now
                </span>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Sign Out of RailGo
                  </p>
                  <p className="text-xs text-red-700/80">
                    Terminates the current token session on this device.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer self-start sm:self-auto"
                >
                  Log Out Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-blue-700 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Edit Profile Details</h3>
                <p className="text-xs text-blue-100">
                  Update your contact name and mobile number.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Email (Permanent)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Passenger Modal */}
      {isAddPassengerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-blue-700 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add New Passenger</h3>
                <p className="text-xs text-blue-100">
                  Save traveler details for speedy bookings.
                </p>
              </div>
              <button
                onClick={() => setIsAddPassengerOpen(false)}
                className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPassenger} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newPassengerName}
                  onChange={(e) => setNewPassengerName(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="28"
                    value={newPassengerAge}
                    onChange={(e) => setNewPassengerAge(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={newPassengerGender}
                    onChange={(e) =>
                      setNewPassengerGender(
                        e.target.value as "Male" | "Female" | "Other"
                      )
                    }
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Berth Preference
                </label>
                <select
                  value={newPassengerBerth}
                  onChange={(e) => setNewPassengerBerth(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:border-blue-600 focus:outline-none"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Lower Berth (LB)">Lower Berth (LB)</option>
                  <option value="Middle Berth (MB)">Middle Berth (MB)</option>
                  <option value="Upper Berth (UB)">Upper Berth (UB)</option>
                  <option value="Side Lower (SL)">Side Lower (SL)</option>
                  <option value="Side Upper (SU)">Side Upper (SU)</option>
                  <option value="Window Seat (WS)">Window Seat (WS)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPassengerOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Add Passenger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
