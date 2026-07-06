import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
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
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Contact Us
              </h1>
            </div>
            <p className="text-white/60 text-lg">
              We&apos;re here to help with questions about loans, your account,
              or anything else.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: <Phone className="w-6 h-6 text-[#003B5C]" />,
                  title: "Phone",
                  value: "(747) 208-0334",
                  desc: "Speak with a loan specialist directly",
                },
                {
                  icon: <Mail className="w-6 h-6 text-[#003B5C]" />,
                  title: "Email",
                  value: "support@pstloans.example",
                  desc: "We typically respond within 24 hours",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-[#003B5C]" />,
                  title: "Office",
                  value: "355 S Grand Ave, Office #20 W",
                  desc: "Los Angeles, CA 90071",
                },
                {
                  icon: <Clock className="w-6 h-6 text-[#003B5C]" />,
                  title: "Support Hours",
                  value: "Mon – Fri, 8:30 AM – 6:30 PM PT",
                  desc: "Closed on weekends & federal holidays",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {card.title}
                      </p>
                      <p className="text-lg font-bold text-[#003B5C] mb-1">
                        {card.value}
                      </p>
                      <p className="text-gray-500 text-sm">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
