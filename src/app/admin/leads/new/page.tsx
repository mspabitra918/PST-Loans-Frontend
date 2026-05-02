"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewLeadPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
        },
      );
      if (response.data.success) {
        toast.success("User created successfully!");
        router.push("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      toast.error("An error occurred while creating the user");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/dashboard")}
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

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Encrypted Session
          </div>
        </div>
      </header>

      {/* FORM */}
      <main className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5"
        >
          <h2 className="text-xl font-bold text-[#003B5C]">Create New User</h2>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Create User
          </Button>
        </form>
      </main>
    </div>
  );
}
