import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-[#0B2C43] bg-[#003B5C] sticky top-0 z-50 text-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-white">
            PST<span className="text-[#4CAF50]">Loans</span>
          </div>
        </Link>
        <div className="flex items-center space-x-2 text-sm font-medium text-white">
          <span>Questions?</span>
          <a
            href="tel:7472005228"
            className="flex items-center hover:underline"
          >
            <Phone className="w-4 h-4 mr-1" />
            (747) 208-0334
          </a>
        </div>
      </div>
    </header>
  );
};
