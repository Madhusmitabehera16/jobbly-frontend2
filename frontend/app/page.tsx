"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";
import {
  Phone,
  Compass,
  ArrowRight,
  Play,
  MapPin,
  User,
  Mic,
  Bot,
  Maximize2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ResumeUpload from "@/components/upload/ResumeUpload";

export default function Home() {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative overflow-x-hidden">
    {/* Background Pattern */}
<div
  className="absolute inset-0 z-0"
  style={{
    backgroundImage: "url('/bg-pattern.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    opacity: 1,
  }}
/>
      
      {/* -----------------------------------------
           1. Top Yellow Contact Bar
           ----------------------------------------- */}
      {/* <div className="w-full bg-[#F4B400] text-slate-900 h-11 flex items-center justify-center gap-2 px-4 select-none relative z-50 shadow-sm">
        <Phone className="w-4 h-4 text-slate-900 stroke-[2.5]" />
        <span className="font-semibold text-sm">
          Call Us:{" "}
          <a
            href="tel:2025550136"
            className="hover:underline transition-opacity duration-200"
          >
            (202) 555-0136
          </a>
        </span>
      </div> */}

      {/* -----------------------------------------
           2. Main Sticky Navbar
           ----------------------------------------- */}
      <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-3xl border-b border-slate-100 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
  <Image
    src="/logo1.png" // place your transparent logo in public/logo.png
    alt="Logo"
    width={42}
    height={42}
    className="w-8 h-8 sm:w-10.5 sm:h-10.5 object-contain group-hover:scale-105 transition-transform duration-300"
    priority
  />

            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-bold font-serif leading-none tracking-tight text-slate-900">
                Jobbly
              </span>
              <span className="hidden xs:inline text-[8px] sm:text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Your AI Career Guide
              </span>
            </div>
          </Link>

          {/* Navigation links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="">
              
            </a>
            {[].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200 py-1"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {loading ? (
              <div className="h-8 w-20 sm:h-9 sm:w-24 bg-slate-100 animate-pulse rounded-xl" />
            ) : currentUser ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Dashboard Button */}
                <Link href="/dashboard">
                  <Button className="bg-[#F4B400] hover:bg-[#E2A600] text-slate-900 font-bold text-[10px] sm:text-xs px-2.5 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-9 rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all">
                    Dashboard
                  </Button>
                </Link>

                {/* Profile Avatar & Name */}
                <div className="hidden md:flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-slate-150">
                    <AvatarFallback className="bg-amber-100 text-slate-700 font-extrabold text-[10px]">
                      {currentUser.name
                        ? currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[80px]">
                    {currentUser.name}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 flex items-center justify-center cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer px-2 py-1 h-8 sm:h-9"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="bg-blue-500 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2.5 h-8 sm:h-9 rounded-xl shadow-[0_4px_14px_rgba(135, 206, 235,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* -----------------------------------------
           3. Hero Section
           ----------------------------------------- */}
      <section className="relative pt-12 pb-24 md:py-24 overflow-visible">
        
        {/* Subtle top-left wave graphic */}
        <div className="absolute top-0 left-0 w-1/2 max-w-[600px] h-full pointer-events-none opacity-40 select-none z-0">
          <svg className="w-full h-auto" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 120C20 180 150 50 300 150C450 250 500 180 650 220" stroke="rgba(244, 180, 0, 0.15)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M-100 150C30 220 170 80 320 190C470 300 520 220 670 260" stroke="rgba(244, 180, 0, 0.1)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M-100 180C40 260 190 110 340 230C490 350 540 260 690 300" stroke="rgba(244, 180, 0, 0.05)" strokeWidth="1.5" strokeDasharray="5 5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-3.5 py-1.5 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-500 fill-[#82CAFF]/10" />
              <span className="text-xs font-semibold text-slate-600">
                Next-Gen Career Navigation Powered by AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6.5xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
              Your{" "}
              <span className="relative inline-block text-blue-500">
                AI-Powered
                <svg
                  className="absolute left-0 bottom-[-6px] w-full h-2"
                  viewBox="0 0 260 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C50.5 3 130.5 1.5 258 5"
                    stroke="#82CAFF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="hidden sm:block" />
              Career Navigator
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Upload your resume, get AI insights, skill gap analysis,
              personalized roadmaps and land your dream job faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            <Button
  onClick={() => {
    const el = document.getElementById("upload-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }}
 className="
  jelly-btn
  bg-blue-500
  hover:bg-blue-500
  text-white
  font-extrabold
  px-8 py-6.5
  rounded-2xl
  shadow-[0_8px_20px_rgba(130,202,255,0.35),inset_0_4px_8px_rgba(255,255,255,0.3)]
  active:scale-95
  transition-all
"
>
  Get Started Free
  <ArrowRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
</Button>
              {/* <Button
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-base px-8 py-6.5 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                See How It Works
                <Play className="w-4 h-4 ml-2 fill-slate-700 stroke-none" />
              </Button> */}
            </div>

            {/* Social Trust Row */}
            {/* <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-8 w-full">
              <div className="flex -space-x-2.5">
                {[
                  { bg: "bg-blue-100", border: "border-blue-400" },
                  { bg: "bg-pink-100", border: "border-pink-400" },
                  { bg: "bg-amber-100", border: "border-amber-400" },
                  { bg: "bg-emerald-100", border: "border-emerald-400" },
                ].map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`w-9.5 h-9.5 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center overflow-hidden shadow-sm`}
                  >
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
                <div className="w-9.5 h-9.5 rounded-full bg-[#F4B400] border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-slate-900 shadow-sm">
                  10K+
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">
                students and professionals trust us to build their careers
              </p>
            </div> */}
          </motion.div>

          {/* Hero Right Visuals (3D Mockup Container) */}
          <div className="hidden lg:flex lg:col-span-7 justify-center items-center h-[540px] md:h-[600px] w-full relative z-10">
            
            {/* Soft Warm Background Blur Blob */}
            <div className="absolute w-[500px] h-[400px] bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-full filter blur-[50px] -bottom-10 right-10 -z-10 opacity-75" />

            {/* Background Grid Pattern */}
            <div className="absolute top-10 right-4 w-28 h-28 bg-[radial-gradient(#EAECF0_2px,transparent_2px)] [background-size:16px_16px] opacity-75 pointer-events-none -z-10" />

            {/* 3D Stack Area */}
            <div className="relative w-full h-full flex items-center justify-center">

              {/* CARD 1: Personalized Roadmap (Left Position) */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -15 }}
                animate={{ opacity: 1, x: 0, rotate: -5 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -10, rotate: -2, scale: 1.02, zIndex: 40 }}
                className="absolute w-[240px] h-[370px] bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.01)] left-6 sm:left-12 bottom-20 z-10 cursor-pointer origin-bottom transition-all duration-300"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)",
                }}
              >
                {/* Blue Curl corner indicator */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 bg-blue-600 rounded-bl-xl shadow-[-2px_2px_4px_rgba(0,0,0,0.15)] z-20"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)", transform: "scaleX(-1) rotate(90deg)" }}
                />
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">Personalized Roadmap</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Custom timeline steps</p>
                  </div>
                </div>

                {/* Timeline flow */}
                <div className="flex flex-col relative pl-5 gap-3">
                  <div className="absolute left-1.5 top-2.5 bottom-2.5 w-0.5 bg-gradient-to-b from-blue-100 via-blue-500 to-emerald-400" />
                  
                  {[
                    { title: "Foundation Skills", dur: "1-2 Weeks", dot: "bg-blue-500" },
                    { title: "Portfolio Projects", dur: "3-6 Weeks", dot: "bg-blue-500" },
                    { title: "API Integration", dur: "7-10 Weeks", dot: "bg-blue-500" },
                    { title: "System Mockups", dur: "11-12 Weeks", dot: "bg-blue-500" },
                    { title: "Deploy & Apply", dur: "13+ Weeks", dot: "bg-emerald-400" },
                  ].map((step, idx) => (
                    <div key={idx} className="relative bg-slate-50/60 border border-slate-100 rounded-xl p-2 flex flex-col">
                      <span className={`absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white ring-4 ring-blue-50 ${step.dot}`} />
                      <span className="text-[10px] font-bold text-slate-800 leading-tight">{step.title}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{step.dur}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CARD 2: Resume Document (Center Position - Front) */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ y: -18, scale: 1.025, zIndex: 40 }}
                className="absolute w-[280px] h-[430px] bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.01)] z-30 cursor-pointer transition-all duration-300"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)",
                }}
              >
                {/* 3D Folded Top Right Page Corner */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 bg-[#F4B400] rounded-bl-xl shadow-[-2px_2px_4px_rgba(0,0,0,0.15)] z-20 pointer-events-none"
                  style={{
                    transformOrigin: "top right",
                  }}
                />

                <h2 className="text-xl font-extrabold tracking-wider text-slate-900 font-serif mb-5 select-none">
                  RESUME
                </h2>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-[#F4B400]">
                    <User className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-slate-100/60 rounded-full" />
                  </div>
                </div>

                {/* Resume Skills section */}
                <div className="mb-5">
                  <h4 className="text-[10px] font-extrabold tracking-wider text-slate-400 mb-2">SKILLS</h4>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { width: "w-14", rating: 4 },
                      { width: "w-10", rating: 3 },
                      { width: "w-12", rating: 5 },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className={`h-1.5 ${row.width} bg-slate-100 rounded-full`} />
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <span
                              key={sIdx}
                              className={`w-1.5 h-1.5 rounded-full ${
                                sIdx < row.rating ? "bg-[#F4B400]" : "bg-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience mock lines */}
                <div className="mb-5">
                  <h4 className="text-[10px] font-extrabold tracking-wider text-slate-400 mb-2.5">EXPERIENCE</h4>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-1.5 w-full bg-slate-100/80 rounded-full" />
                    <div className="h-1.5 w-5/6 bg-slate-100/80 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-slate-100/80 rounded-full" />
                  </div>
                </div>

                {/* Education mock lines */}
                <div>
                  <h4 className="text-[10px] font-extrabold tracking-wider text-slate-400 mb-2.5">EDUCATION</h4>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-1.5 w-full bg-slate-100/80 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-slate-100/80 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: AI Mock Interview (Right Position) */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 15 }}
                animate={{ opacity: 1, x: 0, rotate: 5 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -10, rotate: 2, scale: 1.02, zIndex: 40 }}
                className="absolute w-[250px] h-[390px] bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.01)] right-6 sm:right-12 bottom-12 z-20 cursor-pointer origin-bottom transition-all duration-300"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)",
                }}
              >
                {/* Purple Curl corner indicator */}
               <div
                  className="absolute top-0 right-0 w-8 h-8 bg-purple-600 rounded-bl-xl shadow-[-2px_2px_4px_rgba(0,0,0,0.15)] z-20 pointer-events-none"
                  style={{
                    transformOrigin: "top right",
                  }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Mic className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">AI Mock Interview</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Real-time simulation</p>
                  </div>
                </div>

                {/* Chat dialog content */}
                <div className="flex flex-col gap-3">
                  
                  {/* Bot dialog */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm p-2.5 flex items-start gap-2 max-w-[85%]">
                    <div className="w-4 h-4 bg-slate-900 text-white rounded-md flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                    <span className="text-[9.5px] font-medium leading-normal text-slate-700">
                      Tell me about your last system implementation.
                    </span>
                  </div>

                  {/* Soundwave representation */}
                  <div className="flex items-center justify-center gap-1 h-6 my-1.5">
                    {[6, 12, 20, 10, 16, 8, 22, 14, 18, 10, 6].map((height, i) => (
                      <span
                        key={i}
                        className="w-0.75 bg-[#F4B400] rounded-full transition-all duration-300"
                        style={{
                          height: `${height}px`,
                        }}
                      />
                    ))}
                  </div>

                  {/* User dialog */}
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-2.5 max-w-[85%] self-end shadow-sm">
                    <span className="text-[9.5px] font-medium leading-normal">
                      I built a distributed system using Next.js to process user uploads...
                    </span>
                  </div>
                </div>

                {/* Score Chart Indicator */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-3.5 border-t border-slate-100">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Ring background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#F1F5F9"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#3B82F6"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - 0.85)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-slate-800">85%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">85% Score</span>
                    <span className="text-[10px] text-emerald-500 font-semibold mt-0.5">Good Answer</span>
                  </div>
                </div>
              </motion.div>

              {/* -----------------------------------------
                   Floating speech bubbles
                   ----------------------------------------- */}

              {/* Top Right Floater (Female Avatar + Yellow bubble) */}
              {/* <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-14 right-20 sm:right-28 flex items-center gap-2.5 z-30"
              >
                <div className="bg-[#F4B400] text-slate-900 font-semibold text-[11px] h-8 px-3 rounded-full flex items-center shadow-md border-r-2 border-[#F4B400]">
                  
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-md"> */}
                  {/* Flat vector avatar illustration inside SVG */}
                  {/* <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="20" cy="20" r="20" fill="#FCE7F3"/>
                    <path d="M6 34C6 28 12 25 20 25C28 25 34 28 34 34" fill="#EC4899"/>
                    <circle cx="20" cy="15" r="7" fill="#FDBA74"/>
                    <path d="M12 13C12 8 28 8 28 13" fill="#D946EF" stroke="#D946EF" strokeWidth="1.5"/>
                  </svg>
                </div>
              </motion.div> */}

              {/* Bottom Right Floater (Blue bubble + Male Avatar) */}
              {/* <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-2 right-20 sm:right-32 flex items-center gap-2.5 z-30"
              >
                <div className="bg-blue-600 text-white font-semibold text-[11px] h-8 px-3 rounded-full flex items-center shadow-md">
                  Analyzing profile...
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-md">
                  Flat vector avatar illustration inside SVG
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="20" cy="20" r="20" fill="#E0F2FE"/>
                    <path d="M6 34C6 28 12 25 20 25C28 25 34 28 34 34" fill="#0284C7"/>
                    <circle cx="20" cy="15" r="7" fill="#FED7AA"/>
                    <path d="M13 11C15 8 25 8 27 11" fill="#0369A1" stroke="#0369A1" strokeWidth="1.5"/>
                  </svg>
                </div>
              </motion.div> */}

              {/* Floating expand/action circle button */}
              {/* <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-20 right-2 sm:right-10 w-12 h-12 rounded-full bg-white border border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex items-center justify-center text-slate-800 cursor-pointer z-40"
              >
                <Maximize2 className="w-5 h-5 stroke-[2.5]" />
              </motion.div> */}

            </div>

          </div>

        </div>
      </section>

      {/* Resume Upload Dropzone Section */}
      <ResumeUpload />

      {/* -----------------------------------------
           4. Trust Grid / Core Features Section
           ----------------------------------------- */}
      <section className="bg-slate-50/60 border-t border-slate-100 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything you need to navigate your career path
            </h2>
            <p className="text-slate-500">
              Get personalized mentoring guidance, verify candidate competencies, and automate resume revisions with real feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Roadmap",
                desc: "Discover step-by-step custom timelines built for your tech stack. Track requirements, milestones, and courses.",
                icon: <MapPin className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50/50",
              },
              {
                title: "Resume Analyzer",
                desc: "Get instant ratings on skills, formatting, and layout styles. Reorganize bullets with feedback matching job posts.",
                icon: <User className="w-6 h-6 text-amber-500" />,
                bg: "bg-amber-50/50",
              },
              {
                title: "Mock Interview Practice",
                desc: "Test technical competence in real-time dialog. Receives actionable score breakdown with good response advice.",
                icon: <Mic className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50/50",
              },
            ].map((feat, idx) => (
              <Card key={idx} className="bg-white border-slate-100 rounded-3xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-6`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feat.desc}</p>
                <div className="mt-6 flex items-center text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}