"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hammer, Code, Clock, ArrowUpRight } from "lucide-react";

export default function Projects() {
  const recommendations = [
    {
      title: "URL Shortener Service",
      desc: "Construct a lightweight URL hashing service. Implements cache storage keys, redirect routing logic, and rate limit protections.",
      difficulty: "Beginner",
      tech: ["Node.js", "Redis", "MongoDB"],
      time: "8-12 hours",
      color: "bg-blue-50/50 border-blue-100 text-blue-700",
    },
    {
      title: "Expense Tracker Dashboard",
      desc: "Implement a financial bookkeeping application featuring transaction graphs, relational category tags, and mock CSV output.",
      difficulty: "Beginner",
      tech: ["React", "Express", "PostgreSQL"],
      time: "12-16 hours",
      color: "bg-blue-50/50 border-blue-100 text-blue-700",
    },
    {
      title: "AI Resume Analyzer Tool",
      desc: "Build a document ingestion pipeline parsing skill lists, parsing structure layouts, and recommending formatting fixes.",
      difficulty: "Intermediate",
      tech: ["Next.js", "Python", "FastAPI"],
      time: "20-25 hours",
      color: "bg-amber-50/50 border-amber-100 text-amber-700",
    },
    {
      title: "CI/CD Deployment System",
      desc: "Construct a custom script runner checking source changes, installing package requirements, compiling outputs, and hosting to servers.",
      difficulty: "Advanced",
      tech: ["Docker", "Bash", "AWS EC2"],
      time: "30-40 hours",
      color: "bg-rose-50/50 border-rose-100 text-rose-700",
    },
    {
      title: "Real-time Messaging Platform",
      desc: "Create an active messaging app featuring instant communication loops, workspace channels, message logs, and presence markers.",
      difficulty: "Intermediate",
      tech: ["React", "WebSockets", "Redis"],
      time: "15-20 hours",
      color: "bg-amber-50/50 border-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Project Recommendations
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Hand-picked coding project designs tailored to improve your missing skill segments.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((project, idx) => (
          <Card key={idx} className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              
              {/* Header labels */}
              <div className="flex justify-between items-center mb-4">
                <Badge
                  className={`text-[9px] font-bold py-0.5 px-2.5 rounded-full border ${project.color}`}
                  variant="outline"
                >
                  {project.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{project.time}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {project.desc}
              </p>

            </div>

            {/* Bottom details */}
            <div className="border-t border-slate-50 pt-4 mt-auto">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Code className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {project.tech.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="bg-slate-50 border-slate-200 text-slate-500 text-[9px] font-semibold"
                  >
                    {t}
                  </Badge>
                ))}
                
                <button className="ml-auto text-xs font-bold text-[#F4B400] hover:text-[#E2A600] flex items-center gap-0.5 cursor-pointer">
                  <span>Start project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
