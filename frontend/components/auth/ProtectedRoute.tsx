"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Compass } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#F4B400] w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(244,180,0,0.3)] animate-bounce">
            <Compass className="w-8 h-8 text-white stroke-[2.5] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="flex flex-col items-center mt-2">
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">
              Career<span className="text-[#F4B400]">Navigator</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Restoring Session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
