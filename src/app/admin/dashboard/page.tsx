import React, { Suspense } from "react";
import AdminDashboardClient from "./AdminDashboardClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-[#003B5C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
