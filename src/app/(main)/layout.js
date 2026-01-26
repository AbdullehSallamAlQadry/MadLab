import Navbar from "@/components/layout/navbar/navbarServer";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loading from "../../components/feature/blog/loading";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default async function RootLayout({ children }) {
  
  return (
    <div className="bg-bg-main text-text-main box-border min-h-screen p-0 m-0 w-full flex flex-col">
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<Loading/>}>
          {children}
        </Suspense>
        <Footer />
      </AuthProvider>
      <Toaster position="bottom-right"/>
    </div>
  );
}