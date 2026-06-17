"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, AlertCircle, Sparkles } from "lucide-react";
import { useResumeAnalysis } from "@/src/hooks/useResumeAnalysis";

export default function ResumeAnalysis() {
  const { data, isLoading } = useResumeAnalysis();
  const skills = data?.skills || [];
const summary = data?.summary || "";
const suggestions = data?.suggestions || [];
const experience = data?.experience || [];
const educationSummary = data?.educationSummary || "";

if (isLoading) {
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-slate-500">Loading resume analysis...</p>
    </div>
  );
}

if (!data) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">No Resume Analysis Available</h3>
      <p className="text-slate-500 mt-2">
        Upload and analyze a resume first.
      </p>
    </Card>
  );
}

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Resume Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          ATS parsing summary, identified competencies, and formatting evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: parsed ATS structure view */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 font-serif mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F4B400]" />
              Parsed ATS Sections
            </h2>

            {/* Profile Overview */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Profile Overview
              </span>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Skills detected */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Skills Detected
              </span>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {skills.map((skill: string) => (
                  <Badge
                    key={skill}
                    className="bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold border py-1.5 px-3.5 rounded-xl text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Projects */}
          <div className="border-b border-slate-100 pb-6 mb-6">
  <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
    Projects Evaluated
  </span>

  <div className="space-y-4 mt-4">
    {experience.length > 0 ? (
      experience.map((item, idx) => (
        <div
          key={idx}
          className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4"
        >
          <p className="text-xs text-slate-500 leading-relaxed">
            {item}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-400">
        No experience information found.
      </p>
    )}
  </div>
</div>

            {/* Education */}
            <div>
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Education Detected
              </span>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
  {educationSummary || "No education information found."}
</p>
            </div>

          </Card>
        </div>

        {/* Right Side: Score overview & ATS Checkers */}
        <div className="space-y-6">
          
          {/* ATS Score card */}
        

          {/* Quick AI Optimizer advice */}
        

        </div>

      </div>

    </div>
  );
}
