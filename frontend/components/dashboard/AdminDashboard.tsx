"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Analytics
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Analytics module is currently under development.
        </p>
      </div>

      <Card className="p-8">
        <h2 className="font-bold text-lg">
          Coming Soon
        </h2>

        <p className="text-slate-500 mt-2">
          User growth, resume analytics, interview metrics,
          and platform insights will be displayed here.
        </p>
      </Card>
    </div>
  );
}