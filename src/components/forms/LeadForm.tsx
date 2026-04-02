"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import axios from "axios";
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  Building2,
  UserCircle,
  Briefcase,
  Landmark,
  CheckCircle2,
  Rocket,
  Loader2,
  AlertCircle,
} from "lucide-react";

const leadSchema = z.object({
  loanAmount: z.number().min(500).max(5000),
  zip: z.string().length(5, "Zip must be exactly 5 digits"),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  incomeSource: z.string().min(1, "Required"),
  monthlyNet: z.string().min(1, "Required"),
  payFrequency: z.string().min(1, "Required"),
  bankType: z.string().min(1, "Required"),
  routingNumber: z
    .string()
    .length(9, "Routing number must be exactly 9 digits"),
  accountNumber: z.string().min(4, "Account number is too short"),
  ssnLast4: z.string().length(4, "SSN Last 4 must be exactly 4 digits"),
});

type LeadFormData = z.infer<typeof leadSchema>;
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
  }
>(({ className, label, error, children, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <select
      className={cn(
        "flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003B5C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus-visible:ring-red-500",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = "Select";

export const LeadForm = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadId, setLeadId] = useState("");

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      loanAmount: 2500,
      zip: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      incomeSource: "",
      monthlyNet: "",
      payFrequency: "Bi-Weekly",
      bankType: "",
      routingNumber: "",
      accountNumber: "",
      ssnLast4: "",
    },
    mode: "onChange",
  });

  const processingSteps = [
    "Verifying your identity...",
    "Checking internal liquidity...",
    "Finalizing your offer...",
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingStep((s) => {
          if (s < processingSteps.length - 1) return s + 1;
          return s;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const nextStep = async (fields?: (keyof LeadFormData)[]) => {
    if (fields && Array.isArray(fields)) {
      const isValid = await form.trigger(fields);
      if (!isValid) return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: LeadFormData) => {
    setIsProcessing(true);
    setProcessingStep(0);
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/submit`,
        data,
      );
      setLeadId(response.data.unique_lead_id);
      setIsSuccess(true);
      setIsProcessing(false);
    } catch (error: any) {
      setIsProcessing(false);
      if (error.response?.status === 409) {
        setIsDuplicate(true);
      } else {
        alert(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    }
  };

  const steps = [
    {
      title: "Loan Details",
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Pre-Qual",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Contact Info",
      icon: <UserCircle className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Income",
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Bank & ID",
      icon: <Landmark className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Review",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const progress = (step / steps.length) * 100;

  if (isDuplicate) {
    return (
      <Card className="max-w-md mx-auto border-t-4 border-red-500 shadow-xl overflow-hidden">
        <CardContent className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#003B5C]">
            Application on File
          </CardTitle>
          <p className="text-gray-600 text-sm">
            It looks like you have a recent application on file. Please call{" "}
            <span className="font-bold text-[#003B5C]">(747) 200-5228</span> to
            check your status.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="max-w-md mx-auto shadow-2xl overflow-hidden">
        <CardContent className="p-12 text-center space-y-8">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-16 h-16 text-[#003B5C] animate-spin" />
            <div className="space-y-4 w-full">
              <h3 className="text-xl font-bold text-[#003B5C]">
                {processingSteps[processingStep]}
              </h3>
              <ProgressBar
                value={(processingStep + 1) * 33.3}
                className="h-2"
              />
              <div className="space-y-2 pt-4">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Securing
                  connection...
                </p>
                <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Landmark className="w-3 h-3 text-emerald-500" /> Connecting
                  to internal vault...
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto border-t-4 border-emerald-500 shadow-2xl overflow-hidden">
        <CardContent className="p-10 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-extrabold text-[#003B5C]">
              Application Received!
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Your request has been submitted successfully.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Your Application ID
            </p>
            <div className="bg-[#003B5C] p-5 rounded-2xl">
              <span className="text-3xl font-black text-white tracking-[6px]">
                #PST-{leadId}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left">
            <p className="text-sm text-amber-800 font-bold mb-1">
              Keep your phone nearby
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              A loan officer will be in touch shortly from{" "}
              <span className="font-bold">(747) 200-5228</span> to complete
              verification. Please ensure your phone is available.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left space-y-3">
            <p className="text-xs font-bold text-[#003B5C] uppercase tracking-widest">
              What happens next
            </p>
            {[
              {
                num: "1",
                title: "Review",
                desc: "Our team reviews your application",
              },
              {
                num: "2",
                title: "Verification",
                desc: "We may call to verify your details",
              },
              {
                num: "3",
                title: "Decision",
                desc: "You'll receive an update via email",
              },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#003B5C] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {item.num}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#003B5C]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Confirmation sent to your
              email
            </div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> No credit impact — soft pull
              only
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 relative z-10">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[#003B5C] uppercase tracking-wider">
            Step {step} of {steps.length}
          </span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <ProgressBar value={progress} className="h-2 rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-2xl border-none ring-1 ring-gray-200 bg-white">
            <CardHeader className="bg-gray-50/50 pb-4 border-b">
              <div className="flex items-center gap-3">
                {steps[step - 1].icon}
                <CardTitle className="text-xl font-bold tracking-tight">
                  {steps[step - 1].title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step === 6) form.handleSubmit(onSubmit)();
                }}
                className="space-y-6"
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-[#003B5C]">
                          Loan Amount
                        </label>
                        <span className="text-3xl font-black text-[#003B5C]">
                          ${form.watch("loanAmount").toLocaleString()}
                        </span>
                      </div>
                      <Controller
                        name="loanAmount"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            type="range"
                            min="500"
                            max="5000"
                            step="100"
                            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        )}
                      />
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>Min $500</span>
                        <span>Max $5,000</span>
                      </div>
                    </div>
                    <Input
                      label="Zip Code"
                      placeholder="12345"
                      className="h-14 text-lg"
                      {...form.register("zip")}
                      error={form.formState.errors.zip?.message}
                      maxLength={5}
                      autoComplete="postal-code"
                    />
                    <div className="text-[10px] text-center text-emerald-600 font-bold bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                      Capped at 35.99% APR – No Predatory Rates
                    </div>
                    <Button
                      type="button"
                      className="w-full h-14 text-lg font-bold shadow-lg"
                      onClick={() => nextStep(["zip"])}
                    >
                      Check My Rate <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10 py-4">
                    <div className="space-y-6 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                        <Building2 className="w-8 h-8 text-[#003B5C]" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-[#003B5C]">
                          Quick Eligibility Check
                        </h4>
                        <p className="text-sm text-gray-500">
                          Do you have a valid checking account and earn at least
                          $1,000/mo?
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 border-2 font-bold hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
                          onClick={() => nextStep()}
                        >
                          Yes, I do
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 border-2 font-bold hover:bg-red-50 hover:border-red-500 hover:text-red-700"
                          onClick={() =>
                            alert(
                              "We require a valid checking account and minimum income to proceed.",
                            )
                          }
                        >
                          No, I don&apos;t
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-400"
                      onClick={prevStep}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        placeholder="John"
                        autoComplete="given-name"
                        {...form.register("firstName")}
                        error={form.formState.errors.firstName?.message}
                      />
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        autoComplete="family-name"
                        {...form.register("lastName")}
                        error={form.formState.errors.lastName?.message}
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      {...form.register("email")}
                      error={form.formState.errors.email?.message}
                    />
                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          label="Phone"
                          placeholder="(555) 555-5555"
                          autoComplete="tel"
                          value={field.value}
                          error={form.formState.errors.phone?.message}
                          onChange={(e) => {
                            const digits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            let formatted = digits;
                            if (digits.length > 6) {
                              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                            } else if (digits.length > 3) {
                              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                            } else if (digits.length > 0) {
                              formatted = `(${digits}`;
                            }
                            field.onChange(formatted);
                          }}
                        />
                      )}
                    />
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-gray-400"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-[2] h-14"
                        onClick={() =>
                          nextStep(["firstName", "lastName", "email", "phone"])
                        }
                      >
                        Continue <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <Select
                      label="Income Source"
                      {...form.register("incomeSource")}
                      error={form.formState.errors.incomeSource?.message}
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
                      {...form.register("monthlyNet")}
                      error={form.formState.errors.monthlyNet?.message}
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
                                form.watch("payFrequency") === freq
                                  ? "border-[#003B5C] bg-blue-50"
                                  : "border-gray-100 bg-white hover:border-gray-200",
                              )}
                            >
                              <input
                                type="radio"
                                value={freq}
                                className="w-4 h-4 accent-[#003B5C]"
                                {...form.register("payFrequency")}
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {freq}
                              </span>
                            </label>
                          ),
                        )}
                      </div>
                      {form.formState.errors.payFrequency && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.payFrequency.message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-gray-400"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-[2] h-14"
                        onClick={() =>
                          nextStep([
                            "incomeSource",
                            "monthlyNet",
                            "payFrequency",
                          ])
                        }
                      >
                        Continue <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Bank Type"
                        {...form.register("bankType")}
                        error={form.formState.errors.bankType?.message}
                      >
                        <option value="" disabled>
                          -- Select an option --
                        </option>
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                      </Select>
                      <Input
                        label="SSN (Last 4)"
                        placeholder="1234"
                        maxLength={4}
                        {...form.register("ssnLast4")}
                        error={form.formState.errors.ssnLast4?.message}
                      />
                    </div>
                    <Input
                      label="Routing Number"
                      placeholder="123456789"
                      maxLength={9}
                      {...form.register("routingNumber")}
                      error={form.formState.errors.routingNumber?.message}
                    />
                    <Input
                      label="Account Number"
                      placeholder="000123456"
                      {...form.register("accountNumber")}
                      error={form.formState.errors.accountNumber?.message}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-gray-400"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-[2] h-14"
                        onClick={() =>
                          nextStep([
                            "bankType",
                            "ssnLast4",
                            "routingNumber",
                            "accountNumber",
                          ])
                        }
                      >
                        Review Application{" "}
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
                      <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest text-center">
                        Review Details
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Loan
                          </p>
                          <p className="font-bold text-[#003B5C]">
                            ${form.watch("loanAmount")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Zip
                          </p>
                          <p className="font-bold text-[#003B5C]">
                            {form.watch("zip")}
                          </p>
                        </div>
                        <div className="col-span-2 border-t pt-2"></div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Name
                          </p>
                          <p className="font-bold text-[#003B5C] truncate">
                            {form.watch("firstName")} {form.watch("lastName")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Phone
                          </p>
                          <p className="font-bold text-[#003B5C]">
                            {form.watch("phone")}
                          </p>
                        </div>
                        <div className="col-span-2 border-t pt-2"></div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Income
                          </p>
                          <p className="font-bold text-[#003B5C]">
                            {form.watch("monthlyNet")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Pay
                          </p>
                          <p className="font-bold text-[#003B5C]">
                            {form.watch("payFrequency")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-tight text-center">
                      Confirm your details are accurate. By clicking below, you
                      authorize internal verification.
                    </p>

                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        type="submit"
                        className="w-full h-16 bg-[#003B5C] text-lg font-black shadow-2xl"
                      >
                        🚀 YES, SUBMIT MY REQUEST
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-gray-400 font-bold text-sm"
                        onClick={prevStep}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
