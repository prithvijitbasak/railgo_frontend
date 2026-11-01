import type { Metadata } from "next";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import Header from "@/components/Header";
import ProfileContent from "@/components/ProfileContent";
import Footer from "@/components/Footer";
import { getServerTokenCookie } from "@/lib/authServer";
import { ssrFetch } from "@/lib/authFetch";
import TokenCookieSyncer from "@/components/TokenCookieSyncer";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `My Profile | ${BRAND}`,
  description:
    "View and manage your personal details, travel preferences, saved passengers, and train bookings.",
};

export default async function ProfilePage() {
  const existingToken = await getServerTokenCookie();
  const response = await ssrFetch("/api/public/ssr/home", existingToken);
  const token = response.refreshedToken ?? existingToken ?? null;
  const user = response?.isuser ?? null;

  return (
    <HomeStoreProvider
      authState={{
        token,
        isGuest: !user,
        user,
      }}
    >
      <TokenCookieSyncer token={token} />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <ProfileContent />
        <Footer />
      </div>
    </HomeStoreProvider>
  );
}
