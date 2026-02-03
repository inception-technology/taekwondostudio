"use client";
import Link from "next/link";
import Image from "next/image";

const RootHeader = () => {
  return (
      <div className="flex items-center w-full bg-gray-900 px-20 py-10">
        <Link href="/" className="flex items-center justify-center w-full">
          <Image src="/logo.png" alt="taekwondo studio logo" width={100} height={100} />
        </Link>
      </div>
  );
};

export default RootHeader;
