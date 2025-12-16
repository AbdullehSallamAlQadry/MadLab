import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark:bg-dark-bg-main dark:text-dark-text-main bg-light-bg-main text-light-text-main box-border min-h-screen p-0 m-0">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}