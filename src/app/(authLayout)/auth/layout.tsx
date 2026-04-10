import { Footer } from "@/components/common/Footer/Footer";
import { Navbar } from "@/components/common/Navbar/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-(--akij-page-bg)">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
