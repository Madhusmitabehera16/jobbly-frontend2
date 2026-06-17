"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Briefcase, AlertTriangle, CheckCircle, TrendingUp, Users } from "lucide-react";
import { useAnalytics } from "@/src/hooks/useAnalytics";
// import { useRouter } from "next/navigation";
// import { useState } from "react";


type TabId =
  | "overview"
  | "resume-analysis"
  | "skill-gap"
  | "roadmap"
  | "projects"
  | "interview"
  | "improvements"
  | "job-matching"
  | "admin"
  | "settings";

interface OverviewProps {
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
}

export default function Overview({ setActiveTab }: OverviewProps) {
  const { data, isLoading } = useAnalytics();
  const resumeScore = data?.resumeScore || 0;
  const jobReadiness = data?.jobReadiness || 0;
  const matchPercentage = data?.matchPercentage || 0;
  const missingSkills = data?.missingSkills || [];
  const targetRole = data?.targetRole || "";
  const companyName = data?.companyName || "";
  const resumeSummary = data?.resumeSummary || "";
  const improvementsCount = data?.improvementsCount || 0;
  const questionsCount = data?.questionsCount || 0;
  const roadmapStepsCount = data?.roadmapStepsCount || 0;
  // const router = useRouter();
  // const [activeTab, setActiveTab] = useState<TabId>("overview");
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }
  if (!data) {
    return (
      <Card className="p-8">
        <h3 className="font-bold text-lg">
          No Analytics Available
        </h3>

        <p className="text-slate-500 mt-2">
          Analyze your resume to generate dashboard insights.
        </p>
      </Card>
    );
  }
  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here is a summary of your resume analysis and career tracking.
        </p>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Resume Score */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F4B400]">
                <Award className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Resume Score
              </span>
              <span className="text-4xl font-extrabold text-slate-900 mt-2">
                {resumeScore}%
              </span>
              <div className="mt-4">
                <Progress value={resumeScore} className="h-1.5 bg-slate-100 [&>div]:bg-[#F4B400]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Job Readiness */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Job Readiness
              </span>
              <span className="text-4xl font-extrabold text-slate-900 mt-2">
                {jobReadiness}%
              </span>
              <div className="mt-4">
                <Progress value={jobReadiness} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Match Percentage */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                JD Match Score
              </span>
              <span className="text-4xl font-extrabold text-slate-900 mt-2">
                {matchPercentage}%
              </span>
              <div className="mt-4">
                <Progress value={matchPercentage} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Missing Skills */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Missing Skills
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-16 overflow-y-auto">
                {missingSkills.length > 0 ? (
                  missingSkills.slice(0, 5).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] font-bold py-0.5 px-2"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold italic">None missing</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Target Role */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Role
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-2 truncate" title={targetRole}>
                {targetRole}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 truncate" title={companyName}>
                {companyName ? `at ${companyName}` : "Target details set"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extra layout block - Recent Activity and Next Roadmap Step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Next Milestones timeline summary */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900 font-serif mb-4">
            Resume Summary
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            {resumeSummary}
          </p>
        </Card>

        {/* Quick Target checklist card */}
       <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
  <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
    Target Milestones
  </h3>

  <div className="space-y-3">
    {/* Resume Improvements */}
    <div
      onClick={() => setActiveTab("improvements")}
      className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-50 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-[#F4B400]" />
        <span className="text-xs font-bold text-slate-800">
          Resume Optimization
        </span>
      </div>

      <Badge className="bg-[#F4B400] text-slate-900 hover:bg-[#F4B400] border-none font-bold text-[10px]">
        {improvementsCount} Suggestions
      </Badge>
    </div>

    {/* Mock Interview */}
    <div
      onClick={() => setActiveTab("interview")}
      className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 border border-purple-50 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-bold text-slate-800">
          Mock Interview Prep
        </span>
      </div>

      <Badge className="bg-purple-600 text-white hover:bg-purple-600 border-none font-bold text-[10px]">
        {questionsCount} Questions
      </Badge>
    </div>

    {/* Roadmap */}
    <div
      onClick={() => setActiveTab("roadmap")}
      className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 border border-blue-50 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-800">
          Personalized Roadmap
        </span>
      </div>

      <Badge className="bg-blue-600 text-white hover:bg-blue-600 border-none font-bold text-[10px]">
        {roadmapStepsCount} Weeks
      </Badge>
    </div>
  </div>
</Card>
      </div>

    </div>
  );
}
