import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "HealthCare - Premium Doctor Appointments",
  description:
    "Book appointments with verified doctors in Rawalpindi and Islamabad - premium care, transparent fees, zero waiting.",
};

// Day 13: apply the saved (or system) theme before first paint so
// the page never flashes the wrong theme. Mirrors the logic in
// ThemeProvider; defaults to dark, matching the app's original look.
const themeInitScript = `(function(){try{var t=localStorage.getItem('healthcare-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased dark:bg-navy-900 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
