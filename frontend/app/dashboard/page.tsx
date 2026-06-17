"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Compass,
  LayoutDashboard,
  FileText,
  BarChart2,
  Map,
  Lightbulb,
  Mic,
  ArrowUp,
  Briefcase,
  Sliders,
  Settings as SettingsIcon,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import tabs
import Overview from "@/components/dashboard/Overview";
import ResumeAnalysis from "@/components/dashboard/ResumeAnalysis";
import SkillGap from "@/components/dashboard/SkillGap";
import Roadmap from "@/components/dashboard/Roadmap";
import Projects from "@/components/dashboard/Projects";
import Interview from "@/components/dashboard/Interview";
import Improvements from "@/components/dashboard/Improvements";
import JobMatching from "@/components/dashboard/JobMatching";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Settings from "@/components/dashboard/Settings";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/src/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const queryClient = useMemo(() => new QueryClient(), []);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "resume-analysis", label: "Resume Analysis", icon: <FileText className="w-4 h-4" /> },
    { id: "skill-gap", label: "Skill Gap Analysis", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "roadmap", label: "Career Roadmap", icon: <Map className="w-4 h-4" /> },
    // { id: "projects", label: "Project Suggestions", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "interview", label: "Mock Interview", icon: <Mic className="w-4 h-4" /> },
    { id: "improvements", label: "Resume Improvements", icon: <ArrowUp className="w-4 h-4" /> },
    { id: "job-matching", label: "Job Matching", icon: <Briefcase className="w-4 h-4" /> },
    // { id: "admin", label: "Admin Dashboard", icon: <Sliders className="w-4 h-4" /> },
    // { id: "settings", label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
  ] as const;

  const renderActiveContent = () => {
    switch (activeTab) {
     case "overview":
  return <Overview setActiveTab={setActiveTab} />;
      case "resume-analysis":
        return <ResumeAnalysis />;
      case "skill-gap":
        return <SkillGap />;
      case "roadmap":
        return <Roadmap />;
      case "projects":
        return <Projects />;
      case "interview":
        return <Interview />;
      case "improvements":
        return <Improvements />;
      case "job-matching":
        return <JobMatching />;
      case "admin":
        return <AdminDashboard />;
      case "settings":
        return <Settings />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ProtectedRoute>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-50/50 flex">
        {/* -----------------------------------------
             Sidebar Navigation
             ----------------------------------------- */}
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-100 bg-white sticky top-0 h-screen shrink-0">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-2">
           <Image
                         src="/logo1.png" // place your transparent logo in public/logo.png
                         alt="Logo"
                         width={42}
                         height={42}
                         className="w-8 h-8 sm:w-10.5 sm:h-10.5 object-contain group-hover:scale-105 transition-transform duration-300"
                         priority
                       />
            <span className="text-lg font-bold font-serif text-slate-900 tracking-tight">
              Jobbly
            </span>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-amber-50 text-slate-900 shadow-sm border-l-4 border-[#F4B400] pl-3.5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer profile summary */}
          <div className="p-4 border-t border-slate-50 flex items-center gap-3.5 shrink-0 bg-white">
            <Avatar className="w-9 h-9 border border-slate-150">
              <AvatarFallback className="bg-amber-100 text-slate-700 font-extrabold text-xs">
                {currentUser?.name
                  ? currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-slate-800 truncate">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {currentUser?.role || "user"}
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer Sidebar */}
        <aside
          className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-100 z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Image
                         src="/logo1.png" // place your transparent logo in public/logo.png
                         alt="Logo"
                         width={42}
                         height={42}
                         className="w-8 h-8 sm:w-10.5 sm:h-10.5 object-contain group-hover:scale-105 transition-transform duration-300"
                         priority
                       />
              <span className="text-base font-bold font-serif text-slate-900">
                Jobbly
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-amber-50 text-slate-900 border-l-4 border-[#F4B400] pl-3.5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* -----------------------------------------
             Main Content Area
             ----------------------------------------- */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-3">
              {/* Sidebar mobile toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Input */}
              {/* <div className="relative hidden sm:block w-64 md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search resources, topics, matching jobs..."
                  className="w-full bg-slate-50/60 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F4B400] transition-all"
                />
              </div> */}
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Notifications trigger */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9.5 h-9.5 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {/* Notification dot indicator */}
                {/* <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" /> */}
              </button>

              {/* Notifications Dropdown Panel */}
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 top-11 bg-white border border-slate-100 rounded-2xl w-80 shadow-[0_12px_24px_rgba(0,0,0,0.08)] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="text-xs font-bold text-slate-900 px-4 pb-2 border-b border-slate-50 font-serif">
                      Recent Notifications
                    </h4>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {[
                        { text: "No notifications yet", time: "" },
                       
                      ].map((notif, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 hover:bg-slate-50 text-xs border-b border-slate-50 last:border-none"
                        >
                          <p className="text-slate-700 leading-normal">{notif.text}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* User Profile Info & Logout */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{currentUser?.name}</span>
                  <span className="text-[9px] text-slate-400 font-medium capitalize">
                    {currentUser?.role || "user"}
                  </span>
                </div>
                <Avatar className="w-9 h-9 border border-slate-100">
                  <AvatarFallback className="bg-amber-100 text-slate-700 font-extrabold text-xs">
                    {currentUser?.name
                      ? currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="text-red-500 hover:text-red-900 hover:bg-slate-50 rounded-xl h-9.5 w-9.5 p-0 flex items-center justify-center cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Inner page content container */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {renderActiveContent()}
          </div>

        </main>
        </div>
      </QueryClientProvider>
    </ProtectedRoute>
  );
}


