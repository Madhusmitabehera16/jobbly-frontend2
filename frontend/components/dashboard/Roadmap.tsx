"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Play, BookOpen, Clock } from "lucide-react";
import { useRoadmap } from "@/src/hooks/useRoadmap";

export default function Roadmap() {
  const { data, isLoading } = useRoadmap();
  const title = data?.title || "";
const steps = data?.steps || [];
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Generating roadmap...</p>
    </div>
  );
}
if (!data || steps.length === 0) {
  return (
    <Card className="p-8">
      <h3 className="text-lg font-bold">No Roadmap Available</h3>
      <p className="text-slate-500 mt-2">
        Generate a roadmap first.
      </p>
    </Card>
  );
}

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
  {title || "Career Roadmap"}
</h1>
        <p className="text-slate-500 text-sm mt-1">
          Your step-by-step personalized learning path to achieve SDE job readiness.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative pl-8 md:pl-10 space-y-8">
        
        {/* Connector vertical line */}
        <div className="absolute left-[15px] md:left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-[#F4B400] to-slate-200" />

        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:items-start">
            
            {/* Timeline icon dot overlay */}
            <span
              className={`absolute -left-[33px] md:-left-[37px] top-1.5 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm text-xs font-extrabold z-10 shrink-0 ${
                (step.status || "pending") === "completed"
                  ? "bg-emerald-500 text-white"
                  : (step.status || "pending") === "in-progress"
                  ? "bg-[#F4B400] text-slate-900 ring-4 ring-amber-50"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {(step.status || "pending") === "completed" ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (step.status || "pending") === "in-progress" ? (
                <Play className="w-3.5 h-3.5 fill-slate-900 stroke-none" />
              ) : (
                idx + 1
              )}
            </span>

            {/* Step card detail */}
            <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm flex-1 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                    {step.week}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {step.title}
                  </h3>
                </div>
                
                <Badge
                  className={`text-[10px] font-bold border-none py-0.5 px-2.5 rounded-full ${
                    (step.status || "pending") === "completed"
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                      : (step.status || "pending") === "in-progress"
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-50 animate-pulse"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {(step.status || "pending") === "completed"
                    ? "Completed"
                    : (step.status || "pending") === "in-progress"
                    ? "Active Step"
                    : "Locked"}
                </Badge>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {step.desc}
              </p>

              {/* Action helper */}
              <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {step.status?.replace("-", " ") || "pending"}
                </span>

                {(step.status || "pending") === "in-progress" && (
                  <button className="text-[#F4B400] hover:text-[#E2A600] text-xs font-bold">
                    Continue
                  </button>
                )}
              </div>
            </Card>

          </div>
        ))}

      </div>

    </div>
  );
}
