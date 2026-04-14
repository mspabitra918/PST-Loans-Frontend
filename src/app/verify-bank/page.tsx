import { BankVerificationFlow } from "@/components/forms/BankVerificationFlow";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Bank Verification · PST Loans",
  description:
    "Securely verify your bank account to complete your PST Loans application.",
};

export default function VerifyBankPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
        <BankVerificationFlow />
      </main>
      <Footer />
    </>
  );
}
