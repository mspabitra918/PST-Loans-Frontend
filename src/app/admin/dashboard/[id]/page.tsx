"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Building2,
  UserCircle,
  Briefcase,
  MapPin,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip: string;
  loan_amount: number;
  status: string;
  created_at: string;
  unique_lead_id: string;
  income_source: string;
  monthly_net: number;
  pay_frequency: string;
  bank_type: string;
  bank_name: string;
  routing_number?: string;
  account_number?: string;
  contract_status?: string;
  docusign_envelope_id?: string;
  contract_sent_at?: string;
  contract_signed_at?: string;
}

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  doc_type: string;
  uploaded_at: string;
  signed_url?: string; // Optional signed URL for private Cloudinary resources
}

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchLeadDetail(token);
  }, [id, router]);

  const fetchLeadDetail = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLead(response.data.lead);

      // Also fetch documents for this lead
      const docsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}/documents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDocuments(docsResponse.data.documents || []);
    } catch (error) {
      const queryString = searchParams.toString()
        ? `?${searchParams.toString()}`
        : "";
      router.push(`/admin/dashboard${queryString}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    action: "approve" | "request-documents" | "decline",
    confirmMsg: string,
  ) => {
    if (!confirm(confirmMsg)) return;
    const token = localStorage.getItem("admin_token");
    setActionLoading(action);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(response.data.message);
      // Refresh the lead data
      fetchLeadDetail(token!);
    } catch (error) {
      toast.error("Error performing action. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-[#003B5C] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-[#003B5C]">Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#003B5C] mb-4">
              Lead Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The requested lead could not be found.
            </p>
            <Button
              onClick={() => {
                const queryString = searchParams.toString()
                  ? `?${searchParams.toString()}`
                  : "";
                router.push(`/admin/dashboard${queryString}`);
              }}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                const queryString = searchParams.toString()
                  ? `?${searchParams.toString()}`
                  : "";
                router.push(`/admin/dashboard${queryString}`);
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="text-2xl font-black text-[#003B5C] tracking-tighter">
              PST<span className="text-[#4CAF50]">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="w-9 h-9 bg-[#003B5C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#003B5C]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-600 font-bold flex items-center gap-2"
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#003B5C] tracking-tight">
                Lead Details
              </h1>
              <p className="text-gray-500 font-medium">
                Application #{lead.unique_lead_id}
              </p>
              <p className="text-gray-500 font-medium">
                Created:{" "}
                {new Date(lead.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true, // set false for 24-hour format
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest border ${
                lead.status === "New"
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : lead.status === "Approved"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : lead.status === "Declined"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : lead.status === "Documents Requested"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : lead.status === "Documents Uploaded"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
              }`}
            >
              {lead.status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#003B5C] text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <UserCircle className="w-6 h-6" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Full Name
                    </p>
                    <p className="text-xl font-black text-[#003B5C]">
                      {lead.first_name} {lead.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Contact
                    </p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-[#003B5C] font-bold">
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </p>
                      <p className="flex items-center gap-2 text-[#003B5C] font-bold">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </p>
                      <p className="flex items-center gap-2 text-[#003B5C] font-bold">
                        <MapPin className="w-4 h-4" />
                        ZIP: {lead.zip}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#003B5C] text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Loan Amount
                    </p>
                    <p className="text-3xl font-black text-[#003B5C]">
                      ${lead.loan_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Income Details
                    </p>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-[#003B5C]">
                        {lead.monthly_net.toLocaleString()}/month
                      </p>
                      <p className="text-sm text-gray-500">
                        {lead.income_source} • {lead.pay_frequency}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#003B5C] text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  Banking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Bank Details
                    </p>
                    <p className="text-lg font-bold text-[#003B5C]">
                      {lead.bank_type} • {lead.bank_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Routing Number
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">
                        Encrypted
                      </span>
                    </div>
                    <p className="font-mono font-bold text-[#003B5C] text-lg">
                      {lead.routing_number || "•••••••••"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Account Number
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">
                        Encrypted
                      </span>
                    </div>
                    <p className="font-mono font-bold text-[#003B5C] text-lg">
                      {lead.account_number || "•••••••••"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {documents.length > 0 && (
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#003B5C] text-white p-6">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    Uploaded Documents ({documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#003B5C]" />
                          <div>
                            <p className="font-bold text-[#003B5C] capitalize">
                              {doc.doc_type.replace("-", " ")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {doc.file_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                doc.signed_url || doc.file_path,
                                "_blank",
                              )
                            }
                            className="text-[#003B5C] hover:bg-[#003B5C]/10"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contract Status */}
            {lead.contract_status && lead.contract_status !== "none" && (
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#003B5C] text-white p-6">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <FileText className="w-5 h-5" />
                    Contract Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
                        lead.contract_status === "signed"
                          ? "bg-emerald-50 text-emerald-600"
                          : lead.contract_status === "sent"
                            ? "bg-blue-50 text-blue-600"
                            : lead.contract_status === "delivered"
                              ? "bg-amber-50 text-amber-600"
                              : lead.contract_status === "declined"
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {lead.contract_status === "signed" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {lead.contract_status}
                    </span>
                  </div>
                  {lead.contract_sent_at && (
                    <p className="text-sm text-gray-500">
                      Sent : {new Date(lead.contract_sent_at).toLocaleString()}
                    </p>
                  )}
                  {lead.contract_signed_at && (
                    <p className="text-sm text-emerald-600 font-bold">
                      Signed:{" "}
                      {new Date(lead.contract_signed_at).toLocaleString()}
                    </p>
                  )}
                  {lead.docusign_envelope_id && (
                    <p className="text-xs text-gray-400 mt-2 font-mono truncate">
                      Envelope: {lead.docusign_envelope_id}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden sticky top-28">
              <CardHeader className="bg-[#003B5C] text-white p-6">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={
                    actionLoading !== null || lead.status === "Approved"
                  }
                  onClick={() =>
                    handleAction(
                      "approve",
                      `Approve ${lead.first_name} ${lead.last_name}'s loan for $${Number(lead.loan_amount).toLocaleString()}?\n\nThis will send a contract email to ${lead.email}.`,
                    )
                  }
                >
                  {actionLoading === "approve" ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {actionLoading === "approve"
                    ? "Sending Contract..."
                    : "Approve & Send Contract"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-[#003B5C] text-[#003B5C] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={
                    actionLoading !== null ||
                    lead.status === "Documents Requested"
                  }
                  onClick={() =>
                    handleAction(
                      "request-documents",
                      `Request documents from ${lead.first_name} ${lead.last_name}?\n\nA secure upload link will be emailed to ${lead.email}.`,
                    )
                  }
                >
                  {actionLoading === "request-documents" ? (
                    <div className="w-5 h-5 border-2 border-[#003B5C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  {actionLoading === "request-documents"
                    ? "Sending Request..."
                    : "Request Documents"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-14 text-red-500 hover:bg-red-50 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={
                    actionLoading !== null || lead.status === "Declined"
                  }
                  onClick={() =>
                    handleAction(
                      "decline",
                      `Decline ${lead.first_name} ${lead.last_name}'s application?\n\nA polite rejection email will be sent to ${lead.email}.`,
                    )
                  }
                >
                  {actionLoading === "decline" ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {actionLoading === "decline"
                    ? "Sending Decline..."
                    : "Decline Application"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
