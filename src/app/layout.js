import Navbar from "@/components/navbar/navbarServer";
import Footer from "@/components/footer";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-main text-text-main box-border min-h-screen p-0 m-0 w-384">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}