import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#003B5C] border-t border-[#0B2C43] py-12 px-4 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              PST<span className="text-[#4CAF50]">Loans</span>
            </div>
            <p className="text-white text-xs leading-relaxed max-w-lg">
              PST Loans Disclosure: All loans are subject to credit approval and
              verification. APRs range from 5.99% to 35.99%. Loan terms range
              from 4 to 24 months. For example, a $2,500 loan with an APR of 28%
              and a term of 12 months would have a total cost of $2,895.40 with
              monthly payments of $241.28.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/e-sign"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  E-SIGN Consent
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/partners"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-login"
                  className="text-white inline-block transform transition duration-200 hover:translate-x-2"
                >
                  Admin Portal
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Our Address</h4>
            <p className="text-sm text-white">
              355 S Grand Ave, Office #20 W,
              <br />
              Los Angeles, CA 90071.
            </p>
          </div>
        </div>
        <div className="border-t pt-8 space-y-4">
          <p className="text-xs text-white font-medium">
            Restricted Banks: We do not accept applications using prepaid cards
            or digital-only platforms such as Cash App, Varo, or Chime. A valid
            local or state bank account is required for funding.
          </p>
          <div className="text-xs text-white">
            © {new Date().getFullYear()} PST Loans. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
