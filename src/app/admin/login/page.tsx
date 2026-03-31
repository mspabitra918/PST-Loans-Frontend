"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { Lock, ShieldCheck, Key } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!showMfa) {
        // First step: verify credentials and trigger OTP
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
          {
            email,
            password,
          },
        );

        if (response.data.mfa_required) {
          setShowMfa(true);
        } else {
          // Fallback if MFA is not required (though we set it to true in backend)
          localStorage.setItem("admin_token", response.data.token);
          router.push("/admin/dashboard");
        }
      } else {
        // Second step: verify OTP
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
          {
            email,
            otp: mfaCode,
          },
        );

        if (response.data.success) {
          localStorage.setItem("admin_token", response.data.token);
          setUser(response.data.user);
          router.push("/admin/dashboard");
        } else {
          alert(response.data.message || "Invalid verification code");
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-[#003B5C] text-white p-10 text-center space-y-2">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-3xl font-black tracking-tight">
            Vault Access
          </CardTitle>
          <CardDescription className="text-blue-200/60 font-medium">
            Internal Lender Portal — Secure Session
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {!showMfa ? (
              <>
                <Input
                  label="Administrator Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pstloans.com"
                  className="h-14 font-medium"
                  required
                />
                <Input
                  label="Secret Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 font-medium"
                  required
                />
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Key className="w-5 h-5 text-[#003B5C] mt-1" />
                  <p className="text-xs text-[#003B5C] font-medium leading-relaxed">
                    A multi-factor authentication code has been sent to your
                    registered device. Enter the 6-digit code to continue.
                  </p>
                </div>
                <Input
                  label="MFA Code"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="h-14 text-center text-2xl font-black tracking-[1em] pl-8"
                  maxLength={6}
                  required
                />
              </div>
            )}

            <Button
              className="w-full h-16 text-lg font-black shadow-xl"
              isLoading={isLoading}
              type="submit"
            >
              {showMfa ? "Verify & Unlock" : "Continue to MFA"}
            </Button>

            <div className="pt-4 flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> ISO 27001 Certified
              Environment
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
