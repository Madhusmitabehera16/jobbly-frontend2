"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImprovementsData = exports.getUserAnalytics = exports.getJobMatchingData = exports.getInterviewData = exports.getRoadmapData = exports.getSkillGapData = exports.getResumeAnalysisData = exports.getAnalytics = exports.matchJobs = exports.evaluateInterview = exports.startInterview = exports.improveResume = exports.generateRoadmap = exports.createSkillGap = exports.analyzeResume = exports.parseResume = void 0;
const prisma_1 = require("../config/prisma");
const gemini_service_1 = require("../services/gemini.service");
const resume_service_1 = require("../services/resume.service");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const parseStrictJson = (value) => {
    const first = value.indexOf("{");
    const last = value.lastIndexOf("}");
    if (first === -1 || last === -1) {
        throw new Error("Unable to parse JSON response from AI.");
    }
    const slice = value.slice(first, last + 1);
    return JSON.parse(slice);
};
const loadJobs = async () => {
    const filePath = path_1.default.join(__dirname, "..", "data", "jobs.json");
    const raw = await promises_1.default.readFile(filePath, "utf-8");
    return JSON.parse(raw);
};
const parseResume = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resumeId = Array.isArray(req.params.resumeId)
            ? req.params.resumeId[0]
            : req.params.resumeId;
        if (!resumeId) {
            res.status(400).json({ success: false, message: "Resume ID is required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== user.userId) {
            res.status(404).json({ success: false, message: "Resume not found." });
            return;
        }
        const response = await fetch(resume.fileUrl);
        if (!response.ok) {
            throw new Error("Failed to download resume for parsing.");
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const extractedText = await (0, resume_service_1.extractTextFromBuffer)(buffer, resume.fileUrl);
        const parsed = (0, resume_service_1.parseResumeText)(extractedText);
        const updated = await prisma_1.prisma.resume.update({
            where: { id: resumeId },
            data: { extractedText },
        });
        res.status(200).json({ success: true, resume: updated, parsed });
    }
    catch (error) {
        next(error);
    }
};
exports.parseResume = parseResume;
const analyzeResume = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resumeId = Array.isArray(req.params.resumeId)
            ? req.params.resumeId[0]
            : req.params.resumeId;
        if (!resumeId) {
            res.status(400).json({ success: false, message: "Resume ID is required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== user.userId) {
            res.status(404).json({ success: false, message: "Resume not found." });
            return;
        }
        const extractedText = resume.extractedText;
        if (!extractedText) {
            res.status(400).json({ success: false, message: "Resume must be parsed before analysis." });
            return;
        }
        const prompt = `You are a resume analyst. Provide a strict JSON object with keys: score (0-100), strengths (array), weaknesses (array), atsImprovements (array), missingKeywords (array). Do not include any other text. Resume text:\n\n${extractedText}`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const score = Number(parsed.score) || 0;
        const strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
        const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [];
        const atsImprovements = Array.isArray(parsed.atsImprovements) ? parsed.atsImprovements : [];
        const missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];
        const analysis = await prisma_1.prisma.resumeAnalysis.upsert({
            where: { resumeId },
            update: {
                score,
                strengths,
                weaknesses,
                atsImprovements,
                missingKeywords,
            },
            create: {
                score,
                strengths,
                weaknesses,
                atsImprovements,
                missingKeywords,
                resume: { connect: { id: resumeId } },
            },
        });
        res.status(200).json({ success: true, analysis });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeResume = analyzeResume;
const createSkillGap = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { targetRole } = req.body;
        if (!targetRole) {
            res.status(400).json({ success: false, message: "targetRole is required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        if (!resume || !resume.extractedText) {
            console.log("Resume text length:", resume?.extractedText?.length);
            res.status(404).json({ success: false, message: "Parsed resume not found. Upload and parse your resume first." });
            return;
        }
        const skills = (0, resume_service_1.extractSkillsFromText)(resume.extractedText);
        const prompt = `Compare the following resume skills against requirements for the target role: ${targetRole}. Return strict JSON with currentSkills (array), missingSkills (array), recommendedSkills (array), priorityLevel (string). Resume skills: ${skills.join(", ")} Resume text: ${resume.extractedText}`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const currentSkills = Array.isArray(parsed.currentSkills) ? parsed.currentSkills : skills;
        const missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
        const recommendedSkills = Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : [];
        const priorityLevel = typeof parsed.priorityLevel === "string" ? parsed.priorityLevel : "Medium";
        const skillGap = await prisma_1.prisma.skillGap.create({
            data: {
                targetRole,
                currentSkills,
                missingSkills,
                user: { connect: { id: user.userId } },
            },
        });
        res.status(200).json({ success: true, skillGap, priorityLevel, recommendedSkills });
    }
    catch (error) {
        next(error);
    }
};
exports.createSkillGap = createSkillGap;
const generateRoadmap = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { targetRole } = req.body;
        if (!targetRole) {
            res.status(400).json({ success: false, message: "targetRole is required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        const text = resume?.extractedText ?? "";
        const skills = text ? (0, resume_service_1.extractSkillsFromText)(text) : [];
        const prompt = `Create an 8-week career roadmap for someone targeting ${targetRole}. Use the resume skills: ${skills.join(", ")}. Return strict JSON with title and steps array, where each step includes week and description.`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const title = typeof parsed.title === "string" ? parsed.title : `8-Week Roadmap for ${targetRole}`;
        const steps = Array.isArray(parsed.steps) ? parsed.steps : [];
        const roadmap = await prisma_1.prisma.roadmap.create({
            data: {
                title,
                steps,
                user: { connect: { id: user.userId } },
            },
        });
        res.status(200).json({ success: true, roadmap });
    }
    catch (error) {
        next(error);
    }
};
exports.generateRoadmap = generateRoadmap;
const improveResume = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { resumeId, text } = req.body;
        if (!resumeId || !text) {
            res.status(400).json({ success: false, message: "resumeId and text are required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== user.userId) {
            res.status(404).json({ success: false, message: "Resume not found." });
            return;
        }
        const prompt = `Review the resume text below and generate improvements. Return strict JSON with recommendations array, each recommendation containing before, after, and impact.\n\nResume text: ${text}`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const suggestions = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
        const improvement = {
            id: resumeId,
            suggestions,
        };
        res.status(200).json({ success: true, improvement });
    }
    catch (error) {
        next(error);
    }
};
exports.improveResume = improveResume;
const startInterview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { targetRole } = req.body;
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        if (!resume || !resume.extractedText) {
            res.status(404).json({ success: false, message: "Parsed resume not found. Upload and parse your resume first." });
            return;
        }
        const skills = (0, resume_service_1.extractSkillsFromText)(resume.extractedText);
        const prompt = `Create 10 mock interview questions for a candidate targeting ${targetRole || "a software engineer role"}. Use resume skills: ${skills.join(", ")}. Return strict JSON with questions array.`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
        const interview = await prisma_1.prisma.mockInterview.create({
            data: {
                questions,
                answers: [],
                user: { connect: { id: user.userId } },
            },
        });
        res.status(200).json({ success: true, interview, questions });
    }
    catch (error) {
        next(error);
    }
};
exports.startInterview = startInterview;
const evaluateInterview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { interviewId, question, answer } = req.body;
        if (!interviewId || !question || !answer) {
            res.status(400).json({ success: false, message: "interviewId, question, and answer are required." });
            return;
        }
        const interview = await prisma_1.prisma.mockInterview.findUnique({ where: { id: interviewId } });
        if (!interview || interview.userId !== user.userId) {
            res.status(404).json({ success: false, message: "Interview session not found." });
            return;
        }
        const prompt = `You are a technical interviewer evaluating a candidate's answer to the following question: "${question}".
Analyze the user's answer and return a strict JSON response with no markdown formatting. The JSON must contain exactly these keys:
- "score": Overall Score (0-10) as a number
- "correctnessPercentage": Correctness Percentage (0-100) as a number
- "communicationScore": Communication Score (0-100) as a number
- "technicalAccuracyScore": Technical Accuracy Score (0-100) as a number
- "confidenceScore": Confidence Score (0-100) as a number
- "strengths": Array of strings highlighting strengths
- "weaknesses": Array of strings highlighting weaknesses
- "missingKeyPoints": Array of strings detailing missing concepts
- "improvementSuggestions": Array of strings providing specific suggestions
- "recommendedAnswer": A concise, interview-quality ideal answer string

Candidate's Answer: "${answer}"`;
        const raw = await (0, gemini_service_1.generateGeminiResponse)(prompt);
        const parsed = parseStrictJson(raw);
        const evaluation = {
            score: Number(parsed.score) || 0,
            correctnessPercentage: Number(parsed.correctnessPercentage) || 0,
            communicationScore: Number(parsed.communicationScore) || 0,
            technicalAccuracyScore: Number(parsed.technicalAccuracyScore) || 0,
            confidenceScore: Number(parsed.confidenceScore) || 0,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
            missingKeyPoints: Array.isArray(parsed.missingKeyPoints) ? parsed.missingKeyPoints : [],
            improvementSuggestions: Array.isArray(parsed.improvementSuggestions) ? parsed.improvementSuggestions : [],
            recommendedAnswer: typeof parsed.recommendedAnswer === "string" ? parsed.recommendedAnswer : ""
        };
        const newAnswerRecord = { question, answer, evaluation };
        const answers = Array.isArray(interview.answers) ? [...interview.answers, newAnswerRecord] : [newAnswerRecord];
        const overallScore = Math.round(evaluation.score * 10); // scale 0-10 to 0-100 for overall interview score if needed
        const updated = await prisma_1.prisma.mockInterview.update({
            where: { id: interviewId },
            data: {
                answers,
                score: overallScore,
            },
        });
        res.status(200).json({ success: true, evaluation, interview: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.evaluateInterview = evaluateInterview;
const matchJobs = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { targetRole } = req.body;
        if (!targetRole) {
            res.status(400).json({ success: false, message: "targetRole is required." });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        const skills = resume?.extractedText ? (0, resume_service_1.extractSkillsFromText)(resume.extractedText) : [];
        const jobs = await loadJobs();
        const normalizedSkills = skills.map((skill) => skill.toLowerCase());
        const normalizedTarget = targetRole.toLowerCase();
        const scoredJobs = jobs
            .map((job) => {
            const sharedSkills = job.skills.filter((skill) => normalizedSkills.includes(skill.toLowerCase()));
            const skillScore = Math.min(100, Math.round((sharedSkills.length / Math.max(job.skills.length, 1)) * 100));
            const roleBoost = job.title.toLowerCase().includes(normalizedTarget) ? 15 : 0;
            const score = Math.min(100, skillScore + roleBoost);
            return { ...job, matchScore: score, sharedSkills };
        })
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
        await prisma_1.prisma.jobMatch.deleteMany({ where: { userId: user.userId } });
        await prisma_1.prisma.jobMatch.createMany({
            data: scoredJobs.map((job) => ({
                jobTitle: job.title,
                company: job.company,
                matchScore: job.matchScore,
                userId: user.userId,
            })),
        });
        res.status(200).json({ success: true, jobs: scoredJobs });
    }
    catch (error) {
        next(error);
    }
};
exports.matchJobs = matchJobs;
const getAnalytics = async (_req, res, next) => {
    try {
        const [users, resumes, resumeAnalyses, roadmaps, interviews] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.resume.count(),
            prisma_1.prisma.resumeAnalysis.count(),
            prisma_1.prisma.roadmap.count(),
            prisma_1.prisma.mockInterview.count(),
        ]);
        res.status(200).json({
            success: true,
            analytics: {
                users,
                resumes,
                resumeAnalyses,
                roadmaps,
                interviews,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
// Simplified endpoints for dashboard hooks
const getResumeAnalysisData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        if (!resume || !resume.extractedText) {
            res.status(404).json({ success: false, message: "Resume not found. Please upload a resume first." });
            return;
        }
        const analysis = await prisma_1.prisma.resumeAnalysis.findFirst({
            where: { resumeId: resume.id },
            orderBy: { createdAt: "desc" },
        });
        const parsed = (0, resume_service_1.parseResumeText)(resume.extractedText);
        res.status(200).json({
            success: true,
            analysis: {
                summary: parsed.experience && parsed.experience.length > 0 ? parsed.experience[0] : "Professional with relevant skills and experience.",
                skills: analysis?.strengths || parsed.skills || [],
                experience: parsed.experience || [],
                educationSummary: parsed.education && parsed.education.length > 0 ? parsed.education[0] : "Bachelor's degree",
                suggestions: analysis?.recommendations || analysis?.atsImprovements || [],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getResumeAnalysisData = getResumeAnalysisData;
const getSkillGapData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        if (!resume || !resume.extractedText) {
            res.status(404).json({ success: false, message: "Resume not found. Please upload a resume first." });
            return;
        }
        const latestJobTarget = await prisma_1.prisma.jobTarget.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const targetRole = latestJobTarget?.roleTitle || "Software Development Engineer";
        const skills = (0, resume_service_1.extractSkillsFromText)(resume.extractedText);
        const skillGap = await prisma_1.prisma.skillGap.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const analysis = await prisma_1.prisma.resumeAnalysis.findFirst({
            where: { resumeId: resume.id },
            orderBy: { createdAt: "desc" },
        });
        const currentSkills = skillGap?.currentSkills || skills;
        const missingSkills = skillGap?.missingSkills || [];
        const recommendations = analysis?.recommendations || ["Learn Docker", "Practice system design", "Study CI/CD pipelines"];
        res.status(200).json({
            success: true,
            skillGap: {
                strengths: currentSkills.map((s) => ({ name: s, score: 80 })),
                gaps: missingSkills.map((s, i) => ({
                    name: s,
                    priority: i < 2 ? "High" : "Medium",
                    gap: 75,
                })),
                targetRole,
                matchPercent: analysis?.matchPercentage || Math.floor(currentSkills.length / Math.max(currentSkills.length + missingSkills.length, 1) * 100),
                recommendations,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSkillGapData = getSkillGapData;
const getRoadmapData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const userProfile = await prisma_1.prisma.user.findUnique({ where: { id: user.userId } });
        const targetRole = userProfile?.targetRole || "Software Development Engineer";
        const roadmap = await prisma_1.prisma.roadmap.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        if (roadmap) {
            res.status(200).json({
                success: true,
                roadmap: {
                    title: roadmap.title,
                    steps: roadmap.steps,
                },
            });
        }
        else {
            res.status(200).json({
                success: true,
                roadmap: {
                    title: `8-Week Roadmap for ${targetRole}`,
                    steps: [],
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getRoadmapData = getRoadmapData;
const getInterviewData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const interview = await prisma_1.prisma.mockInterview.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const avgScore = interview?.score || 0;
        res.status(200).json({
            success: true,
            interview: {
                id: interview?.id || "",
                readinessScore: avgScore,
                recommendedQuestions: interview?.questions || [],
                suggestions: [],
                history: interview?.answers || [],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInterviewData = getInterviewData;
const getJobMatchingData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const jobMatches = await prisma_1.prisma.jobMatch.findMany({
            where: { userId: user.userId },
            orderBy: { matchScore: "desc" },
            take: 10,
        });
        res.status(200).json({
            success: true,
            jobMatches: {
                jobs: jobMatches.map((j) => ({
                    jobTitle: j.jobTitle,
                    company: j.company,
                    location: "",
                    salary: "",
                    skills: [],
                    matchScore: j.matchScore,
                })),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobMatchingData = getJobMatchingData;
const getUserAnalytics = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const latestJobTarget = await prisma_1.prisma.jobTarget.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        const analysis = resume
            ? await prisma_1.prisma.resumeAnalysis.findFirst({
                where: { resumeId: resume.id },
                orderBy: { createdAt: "desc" },
            })
            : null;
        const skillGap = await prisma_1.prisma.skillGap.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const improvement = resume
            ? await prisma_1.prisma.resumeImprovement.findFirst({
                where: { resumeId: resume.id },
                orderBy: { createdAt: "desc" },
            })
            : null;
        const interview = await prisma_1.prisma.mockInterview.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const roadmap = await prisma_1.prisma.roadmap.findFirst({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
        });
        const resumeScore = analysis?.score || 0;
        const jobReadiness = latestJobTarget?.jobReadinessScore || 0;
        const matchPercentage = analysis?.matchPercentage || 0;
        const missingSkills = skillGap?.missingSkills || analysis?.missingKeywords || [];
        const companyName = latestJobTarget?.companyName || "";
        const targetRole = latestJobTarget?.roleTitle || user.targetRole || "Software Development Engineer";
        const improvementsCount = improvement
            ? (Array.isArray(improvement.suggestions) ? improvement.suggestions.length : 0)
            : 0;
        const questionsCount = interview
            ? (Array.isArray(interview.questions) ? interview.questions.length : 0)
            : 0;
        const steps = roadmap ? roadmap.steps : [];
        const roadmapStepsCount = Array.isArray(steps) ? steps.length : 0;
        res.status(200).json({
            success: true,
            analytics: {
                resumeScore,
                jobReadiness,
                matchPercentage,
                missingSkills,
                companyName,
                targetRole,
                resumeSummary: analysis?.strengths?.join(", ") || "Resume analyzed successfully.",
                improvementsCount,
                questionsCount,
                roadmapStepsCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserAnalytics = getUserAnalytics;
const getImprovementsData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
        if (!resume) {
            res.status(200).json({
                success: true,
                improvements: {
                    suggestions: [],
                },
            });
            return;
        }
        const improvement = await prisma_1.prisma.resumeImprovement.findFirst({
            where: { resumeId: resume.id },
            orderBy: { createdAt: "desc" },
        });
        const suggestions = improvement?.suggestions || [];
        res.status(200).json({
            success: true,
            improvements: {
                suggestions,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getImprovementsData = getImprovementsData;
//# sourceMappingURL=ai.controller.js.map