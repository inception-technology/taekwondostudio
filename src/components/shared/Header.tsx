"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <div className="header-bar logo-header flex items-center w-full px-20 py-10">
        <Link href="/" className="flex items-center justify-center w-full">
          <Image src="/logo.png" alt="taekwondo studio logo" width={100} height={100} />
        </Link>
        {isAuthenticated && <Navigation />}
      </div>
    </header>
  );
};

export default Header;
