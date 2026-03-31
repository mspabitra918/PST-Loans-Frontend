"use client";

import { UserProvider } from "@/context/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
