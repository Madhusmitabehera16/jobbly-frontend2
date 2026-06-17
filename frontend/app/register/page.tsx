"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { Compass, Eye, EyeOff, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const registerSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoadingState(true);
    try {
      await registerUser(data.name, data.email, data.password);
      showToast("Account created successfully! Redirecting...", "success");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      showToast(message, "error");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
      {/* Background blobs */}
      <div className="absolute w-100 h-75 bg-linear-to-r from-amber-100/30 to-orange-100/30 rounded-full filter blur-[60px] top-10 left-10 -z-10" />
      <div className="absolute w-87.5 h-87.5 bg-linear-to-r from-yellow-100/20 to-amber-200/20 rounded-full filter blur-[70px] bottom-10 right-10 -z-10" />
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
    
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-110 my-8"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
           <Image
               src="/logo1.png" // place your transparent logo in public/logo.png
               alt="Logo"
               width={42}
               height={42}
               className="w-8 h-8 sm:w-10.5 sm:h-10.5 object-contain group-hover:scale-105 transition-transform duration-300"
               priority
             />
            <div className="flex flex-col">
              <span className="text-lg font-bold font-serif leading-none text-blue-500">
                Jobbly
              </span>
              <span className="text-[9px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Your AI Career Guide
              </span>
            </div>
          </Link>
        </div>

        {/* Register Card */}
        <Card className="bg-white border-slate-100 rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] w-full">
          <div className="mb-6">
            <div className="flex items-center gap-1.5 bg-amber-50 text-slate-700 rounded-full px-3 py-1 mb-3 w-fit border border-amber-100/50">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400] fill-[#F4B400]/10" />
              <span className="text-[10px] font-bold">Start For Free</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Join Jobbly to unlock your AI roadmap.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600" htmlFor="name">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                className={`h-11 px-3.5 border-slate-200 focus-visible:border-[#F4B400] focus-visible:ring-[#F4B400]/20 rounded-xl bg-slate-50/30 ${
                  errors.name ? "border-red-300 focus-visible:border-red-400" : ""
                }`}
                disabled={loadingState}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`h-11 px-3.5 border-slate-200 focus-visible:border-[#F4B400] focus-visible:ring-[#F4B400]/20 rounded-xl bg-slate-50/30 ${
                  errors.email ? "border-red-300 focus-visible:border-red-400" : ""
                }`}
                disabled={loadingState}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pl-3.5 pr-11 border-slate-200 focus-visible:border-[#F4B400] focus-visible:ring-[#F4B400]/20 rounded-xl bg-slate-50/30 ${
                    errors.password ? "border-red-300 focus-visible:border-red-400" : ""
                  }`}
                  disabled={loadingState}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loadingState}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pl-3.5 pr-11 border-slate-200 focus-visible:border-[#F4B400] focus-visible:ring-[#F4B400]/20 rounded-xl bg-slate-50/30 ${
                    errors.confirmPassword ? "border-red-300 focus-visible:border-red-400" : ""
                  }`}
                  disabled={loadingState}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loadingState}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loadingState}
              className="w-full bg-blue-500 hover:bg-blue-600 text-slate-900 font-extrabold h-11.5 rounded-xl shadow-[0_4px_14px_rgba(244,180,0,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {loadingState ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
          </form>

          {/* Prompt to log in */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#F4B400] hover:underline"
              >
                Log in
              </Link>
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Custom Floating Toast Alert Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3 rounded-2xl border shadow-[0_12px_32px_rgba(0,0,0,0.06)] backdrop-blur-md max-w-sm ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                : "bg-red-50/95 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-xs font-bold leading-normal">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
