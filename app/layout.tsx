import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "../providers";
import { Suspense } from "react";
import ErrorBoundary from "@/components/error-boundary";
import LoadingSpinner from "@/components/loading-spinner";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Online Job Portal",
  description: "Create your own online job application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Providers>
              {children}
            </Providers>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
};
