import type { Metadata } from "next";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import Header from "@/components/Header";
import ProfileContent from "@/components/ProfileContent";
import Footer from "@/components/Footer";
import { getServerTokenCookie } from "@/lib/authServer";
import { ssrFetch, isForcedLogout } from "@/lib/authFetch";
import TokenCookieSyncer from "@/components/TokenCookieSyncer";
import { BRAND } from "@/lib/constants";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

  if (isForcedLogout(response.data) || isForcedLogout({ action: response.action })) {
    const cookieStore = await cookies();
    const logoutMsg =
      response.data?.message || "Your account is logged on another device";
    cookieStore.set("forced_logout_toast", encodeURIComponent(logoutMsg), {
      maxAge: 10,
      path: "/",
      sameSite: "lax",
    });
    if (response.refreshedToken) {
      cookieStore.set("token", response.refreshedToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });
    } else {
      cookieStore.delete("token");
    }
    redirect("/");
  }

  return (
    <HomeStoreProvider
      authState={{
        token,
        isGuest: !user,
        user,
      }}
    >
      <TokenCookieSyncer
        token={token}
        action={response.action || response.data?.action}
        message={response.data?.message}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <ProfileContent />
        <Footer />
      </div>
    </HomeStoreProvider>
  );
}
