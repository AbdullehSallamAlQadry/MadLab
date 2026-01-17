import Navbar from "@/components/layout/navbar/navbarServer";
import Footer from "@/components/layout/footer";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })()
          `
        }} />
      </head>
      <body className="bg-bg-main text-text-main box-border min-h-screen p-0 m-0 w-384">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
        <Toaster position="bottom-right"/>
      </body>
    </html>
  );
}