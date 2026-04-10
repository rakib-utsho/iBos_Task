import Loading from "@/components/Others/Loader/Loading";
import {
  gravitas,
  lobster,
  openSans,
  playfair,
  roboto,
  rowdies,
} from "@/fonts/Fonts";
import QueryProvider from "@/providers/QueryProvider";
import ReduxProvider from "@/redux/Provider";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Assessment Platform​",
  description: "Powered by Akij Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${playfair.variable} ${lobster.variable} ${roboto.variable} ${gravitas.variable} ${rowdies.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>
          <QueryProvider>
            <ReduxProvider>
              {children}
              <Toaster richColors position="top-right" />
            </ReduxProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
