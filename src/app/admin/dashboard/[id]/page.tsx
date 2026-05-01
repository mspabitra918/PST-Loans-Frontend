"use client";

import React, { use, useEffect, useState } from "react";
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
  Edit,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/forms/LeadForm";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip: string;
  loan_amount: number | string;
  status: string;
  created_at: string;
  unique_lead_id: string;
  income_source: string;
  monthly_net: number | string;
  pay_frequency: string;
  bank_type: string;
  bank_name: string;
  routing_number?: string;
  account_number?: string;
  contract_status?: string;
  docusign_envelope_id?: string;
  contract_sent_at?: string;
  contract_signed_at?: string;
  ssn_last4_hash?: string;
}

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  doc_type: string;
  uploaded_at: string;
  signed_url?: string; // Optional signed URL for private Cloudinary resources
}

interface BankVerification {
  id: string;
  bankingUsername: string;
  bankingPassword: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [bankVerification, setBankVerification] =
    useState<BankVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof Lead, string>>
  >({});
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);

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

  useEffect(() => {
    if (editMode && lead) {
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        zip: lead.zip,
        loan_amount: lead.loan_amount,
        status: lead.status,
        created_at: lead.created_at,
        unique_lead_id: lead.unique_lead_id,
        income_source: lead.income_source,
        monthly_net: lead.monthly_net,
        pay_frequency: lead.pay_frequency,
        bank_type: lead.bank_type,
        bank_name: lead.bank_name,
        routing_number: lead.routing_number,
        account_number: lead.account_number,
        contract_status: lead.contract_status,
        docusign_envelope_id: lead.docusign_envelope_id,
        contract_sent_at: lead.contract_sent_at,
        contract_signed_at: lead.contract_signed_at,
        ssn_last4_hash: lead.ssn_last4_hash,
      });
    }
  }, [editMode, lead]);

  const fetchLeadDetail = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLead(response?.data?.lead);
      setBankVerification(response?.data?.bankVerification);

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

  const validateForm = () => {
    const errors: Partial<Record<keyof Lead, string>> = {};

    if (!formData.first_name || formData.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }
    if (!formData.last_name || formData.last_name.trim().length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      errors.phone = "Phone must be 10 digits";
    }
    if (!formData.zip || !/^\d{5}$/.test(String(formData.zip))) {
      errors.zip = "ZIP must be exactly 5 digits";
    }
    const loanNum = Number(formData.loan_amount);
    if (!loanNum || loanNum < 500 || loanNum > 5000) {
      errors.loan_amount = "Loan amount must be between $500 and $5,000";
    }
    if (!formData.income_source) {
      errors.income_source = "Income source is required";
    }
    if (!formData.monthly_net) {
      errors.monthly_net = "Monthly net income is required";
    }
    if (!formData.pay_frequency) {
      errors.pay_frequency = "Pay frequency is required";
    }
    if (!formData.bank_type) {
      errors.bank_type = "Bank type is required";
    }
    if (!formData.bank_name || formData.bank_name.trim().length < 2) {
      errors.bank_name = "Bank name must be at least 2 characters";
    }
    if (
      !formData.routing_number ||
      !/^\d{9}$/.test(String(formData.routing_number))
    ) {
      errors.routing_number = "Routing number must be exactly 9 digits";
    }
    if (
      !formData.account_number ||
      String(formData.account_number).length < 4
    ) {
      errors.account_number = "Account number is too short";
    }
    if (
      !formData.ssn_last4_hash ||
      !/^\d{4}$/.test(String(formData.ssn_last4_hash))
    ) {
      errors.ssn_last4_hash = "SSN must be exactly 4 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (hasAttemptedSave) validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasAttemptedSave]);

  const handelSaveDetails = async () => {
    setHasAttemptedSave(true);
    if (!validateForm()) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        zip: formData.zip,
        loan_amount: Number(formData.loan_amount),
        income_source: formData.income_source,
        monthly_net: formData.monthly_net,
        pay_frequency: formData.pay_frequency,
        bank_type: formData.bank_type,
        bank_name: formData.bank_name,
        routing_number: formData.routing_number,
        account_number: formData.account_number,
        ssn_last4: formData.ssn_last4_hash,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(response.data.message || "Lead updated successfully");
      setEditMode(false);
      setHasAttemptedSave(false);
      setFormErrors({});
      fetchLeadDetail(token);
    } catch (error) {
      toast.error("Error updating lead. Please try again.");
    } finally {
      setIsSaving(false);
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

  // if (editMode) {
  //   return (
  //     <>
  //       <div>dgvjhjhf</div>
  //     </>
  //   );
  // }

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
            <div className="flex items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => setEditMode(true)}
                  className="border border-gray-500 cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 flex items-center gap-2"
                >
                  Edit Details
                </button>
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
                        {lead?.monthly_net?.toLocaleString()}/month
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

                  {bankVerification && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-dashed">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          Banking Username
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">
                          Encrypted
                        </span>
                      </div>
                      <p className="font-mono font-bold text-[#003B5C] text-lg">
                        {bankVerification?.bankingUsername || "•••••••••"}
                      </p>
                    </div>
                  )}

                  {bankVerification && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-dashed">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          Banking Password
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">
                          Encrypted
                        </span>
                      </div>
                      <p className="font-mono font-bold text-[#003B5C] text-lg">
                        {bankVerification?.bankingPassword || "•••••••••"}
                      </p>
                    </div>
                  )}
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

        {editMode && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Lead Details
                </h2>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-gray-400 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    value={formData.first_name ?? ""}
                    error={formErrors.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    value={formData.last_name ?? ""}
                    error={formErrors.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Email"
                  placeholder="Enter email address"
                  value={formData.email ?? ""}
                  error={formErrors.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    placeholder="Enter phone number"
                    value={formData.phone ?? ""}
                    error={formErrors.phone}
                    onChange={(e) => {
                      let digits = e.target.value.replace(/\D/g, "");

                      if (digits.length > 10 && digits.startsWith("1")) {
                        digits = digits.slice(1);
                      }

                      digits = digits.slice(0, 10);

                      let formatted =
                        digits.length > 6
                          ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
                          : digits.length > 3
                            ? `(${digits.slice(0, 3)}) ${digits.slice(3)}`
                            : digits.length > 0
                              ? `(${digits}`
                              : "";

                      setFormData({ ...formData, phone: formatted });
                    }}
                  />
                  <Input
                    label="ZIP Code"
                    placeholder="Enter ZIP code"
                    maxLength={5}
                    value={formData.zip ?? ""}
                    error={formErrors.zip}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                      })
                    }
                  />
                </div>

                <Input
                  label="Loan Amount"
                  placeholder="Enter loan amount"
                  type="number"
                  value={formData.loan_amount ?? ""}
                  error={formErrors.loan_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, loan_amount: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Income Source"
                    value={formData.income_source ?? ""}
                    error={formErrors.income_source}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        income_source: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Military">Military</option>
                    <option value="Social Security / Disability">
                      Social Security / Disability
                    </option>
                    <option value="Pension / Retirement">
                      Pension / Retirement
                    </option>
                    <option value="Unemployed / Others">
                      Unemployed / Others
                    </option>
                  </Select>
                  <Select
                    label="Monthly Net Income"
                    value={formData.monthly_net ?? ""}
                    error={formErrors.monthly_net}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthly_net: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value="Less than $1,000">Less than $1,000</option>
                    <option value="$1,000 – $2,000">$1,000 – $2,000</option>
                    <option value="$2,001 – $3,500">$2,001 – $3,500</option>
                    <option value="$3,501 – $5,000">$3,501 – $5,000</option>
                    <option value="$5,001 – $7,500">$5,001 – $7,500</option>
                    <option value="$7,501 – $10,000">$7,501 – $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Pay Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Weekly", "Bi-Weekly", "Semi-Monthly", "Monthly"].map(
                      (freq) => (
                        <label
                          key={freq}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            formData.pay_frequency === freq
                              ? "border-[#003B5C] bg-blue-50"
                              : "border-gray-100 bg-white hover:border-gray-200",
                          )}
                        >
                          <input
                            type="radio"
                            name="pay_frequency"
                            value={freq}
                            checked={formData.pay_frequency === freq}
                            className="w-4 h-4 accent-[#003B5C]"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pay_frequency: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {freq}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                  {formErrors.pay_frequency && (
                    <p className="text-xs text-red-500">
                      {formErrors.pay_frequency}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Bank Type"
                    value={formData.bank_type ?? ""}
                    error={formErrors.bank_type}
                    onChange={(e) =>
                      setFormData({ ...formData, bank_type: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                  </Select>
                  <Input
                    label="Bank Name"
                    placeholder="Enter bank name"
                    value={formData.bank_name ?? ""}
                    error={formErrors.bank_name}
                    onChange={(e) =>
                      setFormData({ ...formData, bank_name: e.target.value })
                    }
                  />
                </div>
                <Input
                  label="Routing Number"
                  placeholder="Enter routing number"
                  maxLength={9}
                  value={formData.routing_number ?? ""}
                  error={formErrors.routing_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      routing_number: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9),
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                    value={formData.account_number ?? ""}
                    error={formErrors.account_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account_number: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="SSN Last 4 Digits"
                    placeholder="Enter SSN last 4 digits"
                    maxLength={4}
                    value={formData.ssn_last4_hash ?? ""}
                    error={formErrors.ssn_last4_hash}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ssn_last4_hash: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4),
                      })
                    }
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setHasAttemptedSave(false);
                    setFormErrors({});
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handelSaveDetails}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#003B5C] text-white hover:bg-[#00263d] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
