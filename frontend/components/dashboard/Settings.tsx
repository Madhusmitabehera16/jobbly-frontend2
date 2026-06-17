"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, CreditCard, Sparkles } from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Full Stack Engineer",
  });

  const [toggles, setToggles] = useState({
    emails: true,
    matches: true,
    tips: false,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account profile, notification criteria, and membership parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form and inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 font-serif mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#F4B400]" />
              Profile Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
                />
              </div>

              {/* Target Role */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Role Goal
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400]"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3.5 mt-8 pt-6 border-t border-slate-50">
              <Button variant="ghost" className="text-xs font-bold">Cancel</Button>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all duration-200">
                Save Changes
              </Button>
            </div>

          </Card>

          {/* Toggle triggers */}
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 font-serif mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#F4B400]" />
              Notifications Configuration
            </h2>

            <div className="space-y-4">
              {[
                {
                  key: "emails",
                  label: "Resume Scan Results",
                  desc: "Send email summary notifications whenever you scan a new resume format.",
                },
                {
                  key: "matches",
                  label: "Open Job Matches",
                  desc: "Send alert digests when target matching score matches go active.",
                },
                {
                  key: "tips",
                  label: "Career Strategy Guidance",
                  desc: "Send regular learning tips and career guidance resources recommendation summaries.",
                },
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-start gap-4 py-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug max-w-md">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setToggles({
                        ...toggles,
                        [item.key]: !toggles[item.key as keyof typeof toggles],
                      })
                    }
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer ${
                      toggles[item.key as keyof typeof toggles] ? "bg-[#F4B400]" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 ${
                        toggles[item.key as keyof typeof toggles] ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Billing/Privacy */}
        <div className="space-y-6">
          
          {/* Membership tier */}
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#F4B400]" />
              Membership Tier
            </h3>

            <div className="bg-[#F4B400]/5 border border-[#F4B400]/20 rounded-2xl p-4.5 mb-6 flex gap-3.5 items-start">
              <Sparkles className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5 fill-current" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Premium Pro Plan</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Unlock unlimited resume scans, dashboard sections, and SDE roadmap steps.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 py-2 border-b border-slate-50 mb-3">
              <span>Billing Cycle</span>
              <span className="font-bold text-slate-900">Monthly</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 py-2 border-b border-slate-50 mb-6">
              <span>Renewal Date</span>
              <span className="font-bold text-slate-900">July 3, 2026</span>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-colors duration-200">
              Manage Billing Details
            </button>
          </Card>

          {/* Privacy / Security info */}
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#F4B400]" />
              Data Privacy
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All uploaded resume files are secured on encrypted sandbox indexes. They are never shared publicly or index parsed by search aggregators.
            </p>
            <button className="text-xs font-extrabold text-[#F4B400] hover:text-[#E2A600] underline cursor-pointer">
              Download Personal Data Log
            </button>
          </Card>

        </div>

      </div>

    </div>
  );
}
