"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowUpRight, HelpCircle, Check } from "lucide-react";
import { useSkillGap } from "@/src/hooks/useSkillGap";

export default function SkillGap() {
  const { data, isLoading } = useSkillGap();
 const strengths = data?.strengths || [];
const gaps = data?.gaps || [];
const matchPercent = data?.matchPercent || 0;
const targetRole = data?.targetRole || "";
const recommendations = data?.recommendations || [];
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Loading skill gap analysis...</p>
    </div>
  );
}
if (!data) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">No Skill Gap Analysis Found</h3>
      <p className="text-slate-500 mt-2">
        Generate a skill gap analysis first.
      </p>
    </Card>
  );
}
    return ( <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Skill Gap Analysis
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Compare your current technical competencies against industry requirements for target roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Comparison grid: Current vs Missing */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Skill Comparison Breakdown
              </h2>
              <div className="text-xs text-slate-400 font-medium">
                Target Role: <span className="font-bold text-slate-900">{targetRole}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Current Skills list */}
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider block mb-2">
                  Current Skills (Match)
                </span>
                
                {strengths.map((skill: any) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                        {skill.name}
                      </span>
                      <span className="text-slate-400 font-medium">{skill.score}%</span>
                    </div>
                    <Progress value={skill.score} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                  </div>
                ))}
              </div>

              {/* Missing Skills list */}
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-rose-500 uppercase tracking-wider block mb-2">
                  Missing Skills (Gap)
                </span>
                
                {gaps.map((skill: any) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        {skill.name}
                      </span>
                      <Badge
                        className={`text-[9px] font-bold border-none py-0 px-2 leading-tight ${
                          skill.priority === "High"
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-50"
                            : "bg-amber-50 text-[#F4B400] hover:bg-amber-50"
                        }`}
                      >
                        {skill.priority}
                      </Badge>
                    </div>
                    {/* Reverse indicator: higher value indicates larger missing priority */}
                    <Progress value={skill.gap} className="h-1.5 bg-slate-100 [&>div]:bg-rose-500" />
                  </div>
                ))}
              </div>

            </div>

          </Card>
        </div>

        {/* Right column: matching percentage card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif mb-4">
                Requirement Score
              </h3>
              
              <div className="flex justify-center items-center py-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#F1F5F9"
                      strokeWidth="8.5"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#F4B400"
                      strokeWidth="8.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - matchPercent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-900">{matchPercent}%</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">Match</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed text-center mt-2">
  Your profile satisfies{" "}
  <span className="font-bold">{matchPercent}%</span> of requirements for{" "}
  <span className="font-bold">{targetRole}</span> roles.
</p>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-200 mt-8 flex items-center justify-center gap-1.5">
              <span>View Learning Modules</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Card>
        </div>
<Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-12">
  <h3 className="text-base font-bold text-slate-900 font-serif mb-4">
    Recommendations
  </h3>

  <div className="space-y-3">
    {recommendations.length > 0 ? (
      recommendations.map((rec, idx) => (
        <div
          key={idx}
          className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl"
        >
          {rec}
        </div>
      ))
    ) : (
      <p className="text-xs text-slate-400">
        No recommendations available.
      </p>
    )}
  </div>
</Card>
      </div>

    </div>
  );
}
