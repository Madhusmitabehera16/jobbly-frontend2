"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { useImprovements } from "@/src/hooks/useImprovements";

export default function Improvements() {
  const { data, isLoading } = useImprovements();
  const suggestions = data?.suggestions || [];
  if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Generating resume improvements...</p>
    </div>
  );
}
if (!data || suggestions.length === 0) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">
        No Resume Improvements Available
      </h3>

      <p className="text-slate-500 mt-2">
        Analyze your resume first to receive improvement suggestions.
      </p>
    </Card>
  );
}

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Resume Improvements
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review recommended revisions to rewrite description bullets and maximize index evaluations.
        </p>
      </div>

      {/* Two-column layout grid */}
      <div className="space-y-6">
        {suggestions.map((item, idx) => (
          <Card key={idx} className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            
            {/* Header labels */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-extrabold text-[10px] py-0.5 px-3">
                {item.impact}
              </Badge>
              <span className="text-[10px] text-slate-400 font-semibold italic">
                Reason: {item.metric}
              </span>
            </div>

            {/* Before / After layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Before Card */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Original Bullet
                  </span>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    &ldquo;{item.before}&rdquo;
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
  <span>Original content</span>
</div>
              </div>

              {/* After Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
                {/* Yellow glowing accent corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#F4B400]/5 rounded-bl-3xl pointer-events-none" />

                <div>
                  <span className="text-[9px] font-extrabold text-[#F4B400] uppercase tracking-wider block mb-2.5">
                    Recommended Optimization
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                    &ldquo;{item.after}&rdquo;
                  </p>
                </div>
                
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-600 font-extrabold">
  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
  <span>AI suggested improvement</span>
</div>
              </div>

            </div>

            {/* Apply button link */}


          </Card>
        ))}
      </div>

    </div>
  );
}
