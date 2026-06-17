"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useJobMatches } from "@/src/hooks/useJobMatches";

export default function JobMatching() {
  const { data, isLoading } = useJobMatches();
  const jobs = data?.jobs || [];
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Finding matching jobs...</p>
    </div>
  );
}
if (!data || jobs.length === 0) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">
        No Job Matches Found
      </h3>

      <p className="text-slate-500 mt-2">
        Generate job matches after analyzing your resume.
      </p>
    </Card>
  );
}
  const handleApply = (idx: number) => {
    setAppliedJobs((prev) => ({
      ...prev,
      [idx]: true,
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Job Matching
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Open positions identified matching your detected skills and target compatibility indices.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, idx) => (
          <Card key={idx} className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top border bar matching the score color */}
            <div
              className={`absolute top-0 left-0 w-full h-1.5 ${
                job.matchScore >= 90
                  ? "bg-emerald-500"
                  : job.matchScore >= 80
                  ? "bg-[#F4B400]"
                  : "bg-slate-300"
              }`}
            />

            <div>
              
              {/* Score header */}
              <div className="flex justify-between items-start mb-4 mt-1.5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {job.jobTitle}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {job.company}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xl font-extrabold leading-none ${
                      job.matchScore >= 90
                        ? "text-emerald-600"
                        : job.matchScore >= 80
                        ? "text-[#F4B400]"
                        : "text-slate-500"
                    }`}
                  >
                    {job.matchScore}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Match
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.salary || "Not disclosed"}</span>
                </div>
              </div>

            </div>

            {/* Bottom tools */}
            <div className="border-t border-slate-50 pt-4 flex items-center justify-between gap-3 mt-auto">
              <div className="flex gap-1.5 flex-wrap">
                {(job.skills || []).slice(0, 2).map((t: string) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="bg-slate-50 border-slate-200 text-slate-500 text-[9px] font-semibold py-0 px-2"
                  >
                    {t}
                  </Badge>
                ))}
               {(job.skills?.length || 0) > 2 && (
  <span className="text-[9px] text-slate-400 font-bold self-center">
    +{job.skills!.length - 2} more
  </span>
)}
              </div>

              {appliedJobs[idx] ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Applied</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(idx)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center gap-1 cursor-pointer"
                >
                  <span>Save Job</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
