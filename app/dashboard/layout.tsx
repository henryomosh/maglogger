import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
// import "./globals.css";
import { DashboardLayout } from "@/components/dashboard-components/dashboard-layout";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { fetchStaff } from "@/lib/data";
import { userAuth } from "@/auth";

// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-space-grotesk",
// });

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-dm-sans",
// });

// export const metadata: Metadata = {
//   title: "Radio Station Management System",
//   description: "Professional radio station management dashboard",
//   generator: "v0.app",
// };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const staff = await fetchStaff();

  return (
    <div>
      <AuthProvider staff={staff}>
        <DashboardLayout children={children}></DashboardLayout>
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          duration={8000}
          closeButton
        />
      </AuthProvider>
    </div>
  );
}
