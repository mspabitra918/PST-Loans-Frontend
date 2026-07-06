"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FileUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Landmark,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LeadInfo {
  firstName: string;
  lastName: string;
  uniqueId: string;
  status: string;
}

const DOCUMENT_TYPES = [
  {
    id: "pay-stub",
    title: "Most Recent Pay Stub",
    desc: "Proof of income from within the last 30 days",
    icon: <CreditCard className="w-5 h-5" />,
    required: true,
  },
  {
    id: "id-card",
    title: "Government-Issued ID",
    desc: "Driver's license, passport, or state ID card",
    icon: <UserCheck className="w-5 h-5" />,
    required: true,
  },
  {
    id: "bank-statement",
    title: "Recent Bank Statement",
    desc: "Full statement from within the last 60 days",
    icon: <Landmark className="w-5 h-5" />,
    required: true,
  },
];

export default function UploadPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadInfo();
    }
  }, [id]);

  const fetchLeadInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/public/${id}`,
      );
      setLead(response.data.lead);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid or expired application link.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    setUploading(docType);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/public/${id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setCompletedDocs((prev) => [...prev, docType]);
      toast.success("Document uploaded successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(null);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/public/${id}/complete`,
      );
      toast.success("Application updated! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      toast.error("Failed to finalize submission. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#003B5C] animate-spin" />
            <p className="font-bold text-[#003B5C]">
              Verifying your application...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <Header />
        <main className="grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-red-50 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-[#003B5C] mb-4">
              Link Error
            </h1>
            <p className="text-gray-500 mb-8">
              {error || "This application link is no longer valid."}
            </p>
            <Button
              className="w-full h-14 bg-[#003B5C] hover:bg-[#002B4C] text-white font-bold"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-[#003B5C] py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure
              Document Vault
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Upload Your Documents
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Hi {lead.firstName}, we need a few documents to finalize your loan
              application
              <strong className="text-white"> #PST-{lead.uniqueId}</strong>.
            </p>
          </div>
        </section>

        {/* Upload Interface */}
        <section className="py-16 px-4 -mt-8">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12">
                <div className="grid gap-6">
                  {DOCUMENT_TYPES.map((doc) => {
                    const isCompleted = completedDocs.includes(doc.id);
                    const isUploading = uploading === doc.id;

                    return (
                      <div
                        key={doc.id}
                        className={`group relative p-6 rounded-2xl border-2 transition-all ${
                          isCompleted
                            ? "bg-emerald-50/30 border-emerald-200"
                            : "bg-white border-gray-100 hover:border-blue-100"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-5">
                            <div
                              className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : "bg-blue-50 text-[#003B5C]"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : (
                                doc.icon
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#003B5C]">
                                  {doc.title}
                                </h3>
                                {doc.required && (
                                  <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {doc.desc}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <label
                              className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                                isCompleted
                                  ? "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                                  : "bg-[#003B5C] text-white hover:bg-[#002B4C] shadow-lg shadow-blue-900/10"
                              }`}
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : isCompleted ? (
                                <>
                                  <FileUp className="w-4 h-4" />
                                  Replace File
                                </>
                              ) : (
                                <>
                                  <FileUp className="w-4 h-4" />
                                  Upload Document
                                </>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileUpload(e, doc.id)}
                                disabled={!!uploading}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 pt-12 border-t border-gray-50 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#003B5C]">
                        Your data is encrypted
                      </h4>
                      <p className="text-sm text-gray-400 max-w-md mx-auto mt-1">
                        Documents are processed through our 256-bit SSL
                        encrypted vault and never shared with third parties.
                      </p>
                    </div>
                  </div>

                  {completedDocs.length === DOCUMENT_TYPES.length && (
                    <div className="mt-10">
                      <Button
                        className="h-16 px-10 bg-[#003B5C] hover:bg-[#002B4C] text-white text-lg font-black rounded-2xl flex items-center gap-3 mx-auto shadow-2xl shadow-blue-900/20 disabled:opacity-50"
                        onClick={handleFinish}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Finalizing...
                          </>
                        ) : (
                          <>
                            Finish & Submit <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Need assistance? Call our support team at{" "}
                <strong className="text-gray-600">(747) 208-0334</strong>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
