import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  Shield,
  Clock,
  Landmark,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Section 1: The Hero (The Hook) */}
        <section className="relative bg-white pt-12 pb-20 md:pt-20 md:pb-32 px-4 overflow-hidden">
          {/* Hero background image - replace /hero-family.jpg with your actual image */}
          <Image
            src="/bg-home-img.jpg"
            alt="Happy family feeling relieved after securing a personal loan"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />

          <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold animate-fade-in">
                <Zap className="w-4 h-4 fill-emerald-700" />
                Next-Day Funding Available
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#003B5C] leading-[1.1] tracking-tight">
                Check Your Rate with{" "}
                <span className="text-emerald-500 underline decoration-4 underline-offset-8">
                  No Credit Impact.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Borrow up to{" "}
                <span className="font-black text-[#003B5C]">$5,000</span> with
                transparent rates under 36% APR. No hidden fees. No surprises.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Trust Signal
                    </p>
                    <p className="text-sm font-bold text-[#003B5C]">
                      Capped at 35.99% APR
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Security
                    </p>
                    <p className="text-sm font-bold text-[#003B5C]">
                      256-Bit Encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="absolute -inset-4 bg-[#003B5C]/5 rounded-[2.5rem] -rotate-2 blur-2xl -z-10" />
              <LeadForm />
            </div>
          </div>
        </section>

        {/* Section 2: The Trust Bar (Social Proof) */}
        <section className="py-12 bg-[#003B5C] px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "256-Bit SSL",
                  desc: "Bank-level security",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "No Credit Impact",
                  desc: "Soft-pull only",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Funds by Next Day",
                  desc: "Fast processing",
                },
                {
                  icon: <HeartHandshake className="w-6 h-6" />,
                  title: "Internal Servicing",
                  desc: "We handle your loan",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center space-y-2 group"
                >
                  <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors text-white">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-blue-100/60 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: How It Works & FAQ */}
        <section className="py-24 bg-white px-4 border-b">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-black text-[#003B5C]">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Getting the funds you need shouldn&apos;t be a stress test. Our
                process is built for speed and transparency.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-0" />

              {[
                {
                  step: "01",
                  title: "Request",
                  desc: "Fill out our 2-minute secure form.",
                },
                {
                  step: "02",
                  title: "Verify",
                  desc: "Instant identity & income verification.",
                },
                {
                  step: "03",
                  title: "E-Sign",
                  desc: "Review and sign your agreement.",
                },
                {
                  step: "04",
                  title: "Funding",
                  desc: "Funds sent as early as next day.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 text-center group z-10"
                >
                  <div className="w-12 h-12 bg-[#003B5C] text-white rounded-full flex items-center justify-center font-black mx-auto mb-6 ring-8 ring-blue-50">
                    {item.step}
                  </div>
                  <h4 className="font-black text-[#003B5C] text-xl mb-4">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-32 max-w-4xl mx-auto">
              <h3 className="text-3xl font-black text-[#003B5C] text-center mb-12">
                Common Questions
              </h3>
              <div className="grid gap-6">
                {[
                  {
                    q: "Will this affect my credit score?",
                    a: "Checking your rate with PST Loans results in a soft credit pull, which does not affect your credit score. Hard inquiries only occur after you accept an offer and proceed with funding.",
                  },
                  {
                    q: "How do I pay back my loan?",
                    a: "Repayments are conveniently scheduled through automatic ACH withdrawals from your bank account on your paydays, ensuring you never miss a payment.",
                  },
                  {
                    q: "Is PST Loans a direct lender?",
                    a: "Yes, we service and fund our own loans. We are not a broker—we handle your application, funding, and customer service internally.",
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-[#003B5C]/20 transition-colors"
                  >
                    <h4 className="font-bold text-lg text-[#003B5C] mb-3">
                      {faq.q}
                    </h4>
                    <p className="text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 is the Footer component */}
      </main>
      <Footer />
    </div>
  );
}
