import { Mail, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-(--akij-footer-bg) text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-sm sm:px-6 md:h-16 md:flex-row md:items-center md:justify-between md:py-0 lg:px-8">
        <div className="flex items-center gap-2 text-white/90">
          <span>Powered by</span>
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-white"
          >
            <Image
              src={"/images/logo-reverse.png"}
              alt="Akij Resource Logo"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
          <span className="font-medium text-white">Helpline</span>
          <a
            href="tel:+88011020202505"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <PhoneCall size={15} />
            +88 011020202505
          </a>
          <a
            href="mailto:support@akij.work"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <Mail size={15} />
            support@akij.work
          </a>
        </div>
      </div>
    </footer>
  );
};
