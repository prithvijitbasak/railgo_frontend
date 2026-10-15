import HomeStoreProvider from "@/redux/HomeStoreProvider";
import Header from "@/components/Header";
import HomePageContents from "@/components/HomePageContents";
import Footer from "@/components/Footer";
import { getServerTokenCookie } from "@/lib/authServer";
import { ssrFetch } from "@/lib/authFetch";
import TokenCookieSyncer from "@/components/TokenCookieSyncer";

export default async function Page() {

  const existingToken = await getServerTokenCookie();
  const response = await ssrFetch("/api/public/ssr/home", existingToken);
  const token = response.refreshedToken ?? existingToken ?? null;

  console.log("Showing from home ssr",response.data);

  return (
    <HomeStoreProvider
      authState={{
        token,
        isGuest: !existingToken,
      }}
    >
      <TokenCookieSyncer token={token} />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <HomePageContents />
        <Footer />
      </div>
    </HomeStoreProvider>
  );
}