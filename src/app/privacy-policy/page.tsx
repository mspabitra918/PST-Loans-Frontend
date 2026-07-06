import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Database,
  Phone,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />
      <main className="grow">
        {/* Hero Banner */}
        <section className="bg-[#003B5C] py-16 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-white/60 text-lg">
              Effective date: January 1, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl space-y-8">
            {[
              {
                icon: <Database className="w-6 h-6 text-[#003B5C]" />,
                title: "Information We Collect",
                content:
                  "We collect personal information you provide when you submit an application, including name, email, phone, SSN last 4, bank details, and employment data. We also collect usage data in accordance with standard web analytics practices.",
              },
              {
                icon: <Eye className="w-6 h-6 text-[#003B5C]" />,
                title: "How We Use Your Information",
                content:
                  "Your data is used to process loan applications, verify identity, perform compliance checks, and communicate with you about your account. We do not sell your information to third parties.",
              },
              {
                icon: <UserCheck className="w-6 h-6 text-[#003B5C]" />,
                title: "Third-Party Sharing",
                content:
                  "We may share data with credit bureaus, identity verification services, and payment processors strictly as needed to service your loan. We never sell personal data to marketers or data brokers.",
              },
              {
                icon: <Lock className="w-6 h-6 text-[#003B5C]" />,
                title: "Security",
                content:
                  "We implement physical, administrative, and technical safeguards — including 256-bit SSL encryption — designed to protect your data from unauthorized access, disclosure, or misuse.",
              },
              {
                icon: <Phone className="w-6 h-6 text-[#003B5C]" />,
                title: "Contact",
                content:
                  "Questions about this policy can be sent to support@pstloans.example or (747) 208-0334.",
              },
            ].map((section, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#003B5C] mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
