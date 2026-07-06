import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PenTool, FileCheck, Monitor, MailX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ESignConsentPage() {
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
                <PenTool className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                E-SIGN Consent
              </h1>
            </div>
            <p className="text-white/60 text-lg max-w-2xl">
              By providing your consent, you agree to receive and sign documents
              electronically in connection with your loan.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl space-y-8">
            {[
              {
                icon: <FileCheck className="w-6 h-6 text-[#003B5C]" />,
                title: "Electronic Records",
                content:
                  "You agree that all disclosures, notices, and documents related to your loan — including the loan agreement, payment schedules, and account statements — may be delivered to you electronically via email or through your online account.",
              },
              {
                icon: <Monitor className="w-6 h-6 text-[#003B5C]" />,
                title: "Hardware & Software Requirements",
                content:
                  "To access and retain electronic documents, you need: an internet-connected device (computer, tablet, or smartphone), a current web browser with cookies enabled (e.g. Chrome, Safari, Firefox, Edge), and a valid email address. A printer or the ability to save PDFs is recommended for your records.",
              },
              {
                icon: <MailX className="w-6 h-6 text-[#003B5C]" />,
                title: "Withdrawing Consent",
                content:
                  "You may withdraw your consent to receive electronic documents at any time by contacting us at support@pstloans.example or (747) 208-0334. Withdrawing consent may limit our ability to service your loan and could result in paper document fees.",
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
