"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Award, HelpCircle, StopCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useInterview } from "@/src/hooks/useInterview";
import api from "@/src/lib/api";
import { InterviewEvaluation } from "@/src/types/api";

export default function Interview() {
  const { data, isLoading } = useInterview();
  const questions = data?.recommendedQuestions || [];
  const readinessScore = data?.readinessScore || 0;
  
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const activeQuestion = selectedQuestion || questions[0] || "";

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  
  // Submission State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // History 
  const history = data?.history || [];

  useEffect(() => {
    // Check if the selected question has a history item
    const pastAnswer = history.find(h => h.question === activeQuestion);
    if (pastAnswer) {
      setTranscript(pastAnswer.answer);
      setEvaluation(pastAnswer.evaluation);
    } else {
      setTranscript("");
      setEvaluation(null);
    }
    setErrorMsg("");
  }, [activeQuestion, history]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        
        recog.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recog.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            setErrorMsg("Microphone permission denied.");
            setIsRecording(false);
          }
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const toggleRecording = () => {
    setErrorMsg("");
    if (!recognition) {
      setErrorMsg("Your browser does not support speech recognition.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setEvaluation(null);
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      setErrorMsg("Please record an answer before submitting.");
      return;
    }
    if (!data?.id) {
      setErrorMsg("Interview session not found.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setErrorMsg("");
    setEvaluation(null);

    try {
      const response = await api.post("/ai/interview/evaluate", {
        interviewId: data.id,
        question: activeQuestion,
        answer: transcript
      });

      if (response.data.success) {
        setEvaluation(response.data.evaluation);
        
        // Optically push to history since we don't have mutate from SWR/react-query set up easily here
        // The user would see it when they reload or we can just rely on the local state which is fine 
        // as the evaluation state stays rendered until they switch questions.
      } else {
        setErrorMsg("Failed to evaluate the answer.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to evaluate answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8">
        <h3 className="font-bold text-lg">No Interview Session Found</h3>
        <p className="text-slate-500 mt-2">Generate interview questions first.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header with score card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Mock Interview Practice
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Simulate real-world screening interviews and get immediate score evaluations.
          </p>
        </div>

        {/* Score card widget */}
        <Card className="bg-white border-slate-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Interview Readiness
            </span>
            <span className="text-base font-extrabold text-slate-900">{readinessScore}%</span>
          </div>
          <Progress value={readinessScore} className="h-1.5 bg-slate-100 [&>div]:bg-purple-600" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 lg:min-h-[600px]">
        
        {/* Left Side: Question List Selector */}
        <Card className="bg-white border-slate-100 rounded-3xl p-5 shadow-sm lg:col-span-4 flex flex-col h-[300px] lg:h-[600px] overflow-hidden">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            Interview Questions
          </h3>

          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {questions.map((q) => {
              const isAnswered = history.some(h => h.question === q);
              return (
                <button
                  key={q}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all duration-200 cursor-pointer flex justify-between items-center gap-2 ${
                    activeQuestion === q
                      ? "bg-purple-50 border-purple-200 text-purple-800 shadow-sm"
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="line-clamp-2">{q}</span>
                  {isAnswered && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Side: Recording & Evaluation */}
        <Card className="bg-white border-slate-100 rounded-3xl shadow-sm lg:col-span-8 flex flex-col h-auto overflow-hidden relative p-6 md:p-8">
          
          {/* Question Display */}
          <div className="mb-6">
            <h2 className="text-sm font-extrabold text-slate-400 tracking-wider mb-2">Question</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner">
              <p className="text-lg font-semibold text-slate-800 leading-relaxed">
                {activeQuestion || "Select a question to begin"}
              </p>
            </div>
          </div>

          {/* Recording Status and Loading States */}
          <div className="mb-4 flex flex-wrap gap-2 items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recording Status:</span>
              {isRecording ? (
                <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md">Recording</Badge>
              ) : isEvaluating ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md">Processing</Badge>
              ) : (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md">Ready</Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Loading State:</span>
              {isRecording && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md animate-pulse border border-rose-100">Recording...</span>
              )}
              {isEvaluating && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md animate-pulse border border-amber-100">Analyzing answer...</span>
              )}
              {evaluation && !isRecording && !isEvaluating && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">Evaluation complete</span>
              )}
              {!evaluation && !isRecording && !isEvaluating && (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">Idle</span>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          <div className="mb-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Your Answer</h2>
            </div>
            
            <textarea
              readOnly
              value={transcript}
              placeholder={isRecording ? "Listening..." : "Click 'Start Answering' and speak your answer..."}
              className={`w-full flex-1 min-h-[120px] p-4 rounded-2xl border resize-none focus:outline-none bg-white text-slate-700 transition-colors ${
                isRecording ? "border-rose-200 shadow-[0_0_15px_rgba(243,24,96,0.1)]" : "border-slate-200"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 shrink-0">
            {!evaluation && (
              <button
                onClick={toggleRecording}
                disabled={isEvaluating}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50 ${
                  isRecording 
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording ? "Stop Recording" : "Start Answering"}
              </button>
            )}

            {!evaluation && transcript && (
              <button
                onClick={submitAnswer}
                disabled={isEvaluating || !transcript.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50"
              >
                {isEvaluating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Send className="w-5 h-5" /> Submit Answer</>
                )}
              </button>
            )}
            
            {evaluation && (
               <button
                 onClick={() => { setTranscript(""); setEvaluation(null); setErrorMsg(""); }}
                 className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
               >
                 Try Again
               </button>
            )}
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4 border-t border-slate-100 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                AI Evaluation
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                  <div className="text-2xl font-black text-purple-700">{evaluation.score}<span className="text-sm font-semibold text-purple-400">/10</span></div>
                  <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">Score</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-xl font-bold text-slate-800">{evaluation.correctnessPercentage}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Correctness</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-xl font-bold text-slate-800">{evaluation.technicalAccuracyScore}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Tech Accuracy</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-xl font-bold text-slate-800">{evaluation.communicationScore}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Communication</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-xl font-bold text-slate-800">{evaluation.confidenceScore}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Confidence</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Strengths</h3>
                  <ul className="space-y-1.5">
                    {evaluation.strengths?.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-emerald-500">•</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-700 mb-2 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Areas for Improvement</h3>
                  <ul className="space-y-1.5">
                    {evaluation.weaknesses?.map((w, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-rose-500">•</span>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {evaluation.missingKeyPoints && evaluation.missingKeyPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-amber-700 mb-2">Missing Key Points</h3>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.missingKeyPoints.map((p, i) => (
                      <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.improvementSuggestions && evaluation.improvementSuggestions.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">Suggestions</h3>
                  <ul className="space-y-1.5">
                    {evaluation.improvementSuggestions.map((s, i) => (
                      <li key={i} className="text-xs text-blue-700 flex gap-2"><span className="text-blue-500 mt-0.5">→</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-slate-900 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  Recommended Interview Answer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                  {evaluation.recommendedAnswer}
                </p>
              </div>

            </div>
          )}

        </Card>
      </div>
    </div>
  );
}
