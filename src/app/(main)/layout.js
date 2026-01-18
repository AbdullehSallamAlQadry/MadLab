import Navbar from "@/components/layout/navbar/navbarServer";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loading from "../../components/feature/blog/loading";

export default async function RootLayout({ children }) {
  
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<Loading/>}>
          {children}
        </Suspense>
        <Footer />
      </AuthProvider>
      <Toaster position="bottom-right"/>
    </>
  );
}