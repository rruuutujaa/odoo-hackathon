import type { Metadata } from "next";
import { Calistoga, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const displayFont = Calistoga({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traveloop - The Art of Journey",
  description: "Bespoke travel planning for the modern explorer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative min-h-screen overflow-hidden bg-background selection:bg-[#FF6B35] selection:text-white">
              {/* Signature Detail: Animated Sunset Mesh */}
              <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF6B35]/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-[#FF6B35]/5 blur-[80px]" />
              </div>
              
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
