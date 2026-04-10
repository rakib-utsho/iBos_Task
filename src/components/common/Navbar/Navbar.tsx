import Image from "next/image";
import Link from "next/link";
import AuthActions from "./AuthActions";

export const Navbar = () => {
  return (
    <header className="w-full border-b border-(--akij-border) bg-(--akij-header-bg)">
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="z-10 shrink-0">
          <Image
            src={"/images/logo.png"}
            alt="Akij Resource Logo"
            width={100}
            height={40}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <h1 className="pointer-events-none absolute left-1/2 w-[58vw] max-w-105 -translate-x-1/2 truncate text-center text-lg font-semibold tracking-tight text-(--akij-heading) sm:w-[48vw] sm:text-xl md:w-auto md:max-w-none md:text-[30px]">
          Akij Resource
        </h1>

        <AuthActions />
      </div>
      <div className="sr-only" aria-label="Application name">
        Akij Resource
      </div>
    </header>
  );
};
