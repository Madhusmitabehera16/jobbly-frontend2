"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyResume = exports.parseResume = exports.upload = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma_1 = require("../config/prisma");
const resume_service_1 = require("../services/resume.service");
const gemini_service_1 = require("../services/gemini.service");
// POST /api/resume/upload
const upload = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        const { companyName, roleTitle, jobDescription } = req.body;
        if (!companyName || !roleTitle || !jobDescription) {
            res.status(400).json({ success: false, message: "Company name, role title, and job description are required." });
            return;
        }
        // 1. Upload to Cloudinary
        console.log("STEP 1: File received:", file.originalname);
        let uploadResult;
        try {
            uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: "raw",
                    type: "upload",
                    access_mode: "public",
                    use_filename: true,
                    unique_filename: true,
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end(file.buffer);
            });
            console.log("STEP 2: Cloudinary upload success", uploadResult.secure_url);
        }
        catch (error) {
            console.error("Cloudinary upload failed:", error);
            res.status(502).json({ success: false, message: "Failed to upload resume to storage" });
            return;
        }
        // 2. Extract text from buffer immediately
        console.log("STEP 3: Extracting text from buffer...");
        let extractedText;
        try {
            extractedText = await (0, resume_service_1.extractTextFromBuffer)(file.buffer, file.originalname);
            console.log("STEP 4: Text extracted successfully. Length:", extractedText.length);
        }
        catch (error) {
            console.error("Text extraction failed:", error);
            res.status(500).json({ success: false, message: "Failed to extract text from resume" });
            return;
        }
        // 3. Save Resume record and JobTarget record
        let resume;
        let jobTarget;
        try {
            console.log("STEP 4.5: Saving to database...");
            resume = await prisma_1.prisma.resume.create({
                data: {
                    fileUrl: uploadResult.secure_url,
                    extractedText,
                    user: { connect: { id: user.userId } },
                },
            });
            jobTarget = await prisma_1.prisma.jobTarget.create({
                data: {
                    companyName,
                    roleTitle,
                    jobDescription,
                    jobReadinessScore: 0,
                    user: { connect: { id: user.userId } },
                },
            });
            console.log("Database records created successfully");
        }
        catch (error) {
            console.error("Database save failed:", error);
            res.status(500).json({ success: false, message: "Failed to save data to database" });
            return;
        }
        // 5. Call Gemini for consolidated analysis
        console.log("STEP 5: Prompting Gemini for targeted analysis...");
        const prompt = `You are a staff-level technical recruiter, resume writer, and career coach.
Analyze the candidate's resume against the target job target:
Role: ${roleTitle}
Company: ${companyName}
Job Description:
${jobDescription}

Candidate Resume Text:
${extractedText}

Provide a strict, valid JSON response. Do not output markdown codeblocks (like \`\`\`json ... \`\`\`) or any other conversational text. Return exactly this JSON structure:
{
  "resumeAnalysis": {
    "score": 85,
    "matchPercentage": 80,
    "strengths": ["list of strengths based on JD matches"],
    "weaknesses": ["list of areas of weakness relative to JD"],
    "missingKeywords": ["important tools/terms from JD missing on resume"],
    "recommendations": ["specific suggestions to tailor resume to this target role"]
  },
  "jobReadiness": {
    "score": 78
  },
  "skillGap": {
    "missingSkills": ["skills required by JD but missing on resume"],
    "weakSkills": ["skills mentioned on resume but not demonstrated with strong experience"],
    "learningPriority": "High"
  },
  "resumeOptimization": {
    "suggestions": [
      {
        "before": "original phrasing or bullet point",
        "after": "improved phrasing showcasing metrics and impact related to JD",
        "impact": "High Impact",
        "metric": "Metrics alignment"
      }
    ]
  },
  "interviewQuestions": {
    "technical": ["technical question 1", "technical question 2"],
    "behavioral": ["behavioral question 1", "behavioral question 2"],
    "project": ["project question 1", "project question 2"]
  },
  "roadmap": {
    "title": "8-Week Career Roadmap for ${roleTitle} at ${companyName}",
    "steps": [
      {
        "week": "Week 1",
        "title": "Learning Topic",
        "description": "Weekly details on what to study to address skill gaps."
      }
    ]
  }
}`;
        let aiResponse;
        try {
            aiResponse = await (0, gemini_service_1.generateGeminiResponse)(prompt);
            console.log("Gemini API call successful. Length:", aiResponse.length);
        }
        catch (error) {
            console.error("Gemini API call failed:", error.message || error);
            res.status(502).json({ success: false, message: "Failed to communicate with AI service. Please check API keys and network." });
            return;
        }
        // Parse response JSON
        let parsedData;
        try {
            const first = aiResponse.indexOf("{");
            const last = aiResponse.lastIndexOf("}");
            if (first === -1 || last === -1) {
                throw new Error("Invalid response format");
            }
            parsedData = JSON.parse(aiResponse.slice(first, last + 1));
        }
        catch (parseError) {
            console.error("Gemini JSON parse failed. Error:", parseError.message);
            console.error("Raw AI response was:", aiResponse);
            res.status(500).json({ success: false, message: "Failed to parse AI response. The model did not return a valid JSON structure." });
            return;
        }
        // Extract metrics from parsed AI response
        const analysisData = parsedData.resumeAnalysis || {};
        const readinessData = parsedData.jobReadiness || {};
        const skillGapData = parsedData.skillGap || {};
        const optData = parsedData.resumeOptimization || {};
        const interviewData = parsedData.interviewQuestions || {};
        const roadmapData = parsedData.roadmap || {};
        // 6. Save ResumeAnalysis
        const resumeScore = Number(analysisData.score) || 0;
        const matchPercentage = Number(analysisData.matchPercentage) || 0;
        const strengths = Array.isArray(analysisData.strengths) ? analysisData.strengths : [];
        const weaknesses = Array.isArray(analysisData.weaknesses) ? analysisData.weaknesses : [];
        const missingKeywords = Array.isArray(analysisData.missingKeywords) ? analysisData.missingKeywords : [];
        const recommendations = Array.isArray(analysisData.recommendations) ? analysisData.recommendations : [];
        await prisma_1.prisma.resumeAnalysis.create({
            data: {
                score: resumeScore,
                matchPercentage,
                strengths,
                weaknesses,
                missingKeywords,
                recommendations,
                atsImprovements: recommendations,
                resume: { connect: { id: resume.id } },
            },
        });
        // 7. Update JobTarget with Job Readiness Score
        const jobReadinessScore = Number(readinessData.score) || 0;
        await prisma_1.prisma.jobTarget.update({
            where: { id: jobTarget.id },
            data: { jobReadinessScore },
        });
        // 8. Save SkillGap
        const currentSkills = (0, resume_service_1.extractSkillsFromText)(extractedText);
        const missingSkills = Array.isArray(skillGapData.missingSkills) ? skillGapData.missingSkills : [];
        const weakSkills = Array.isArray(skillGapData.weakSkills) ? skillGapData.weakSkills : [];
        const learningPriority = typeof skillGapData.learningPriority === "string" ? skillGapData.learningPriority : "Medium";
        await prisma_1.prisma.skillGap.create({
            data: {
                targetRole: roleTitle,
                currentSkills,
                missingSkills,
                weakSkills,
                learningPriority,
                user: { connect: { id: user.userId } },
            },
        });
        // 9. Save ResumeImprovement
        const suggestionsList = Array.isArray(optData.suggestions) ? optData.suggestions : [];
        await prisma_1.prisma.resumeImprovement.create({
            data: {
                resumeId: resume.id,
                suggestions: suggestionsList,
            },
        });
        // 10. Save MockInterview
        const combinedQuestions = [
            ...(Array.isArray(interviewData.technical) ? interviewData.technical : []),
            ...(Array.isArray(interviewData.behavioral) ? interviewData.behavioral : []),
            ...(Array.isArray(interviewData.project) ? interviewData.project : []),
        ];
        await prisma_1.prisma.mockInterview.create({
            data: {
                questions: combinedQuestions,
                answers: [],
                score: jobReadinessScore,
                user: { connect: { id: user.userId } },
            },
        });
        // 11. Save Roadmap
        const roadmapSteps = Array.isArray(roadmapData.steps) ? roadmapData.steps : [];
        const formattedSteps = roadmapSteps.map((step, idx) => ({
            week: step.week || `Week ${idx + 1}`,
            title: step.title || "Topic Details",
            description: step.description || step.desc || "",
            desc: step.description || step.desc || "",
            status: "pending",
        }));
        await prisma_1.prisma.roadmap.create({
            data: {
                title: roadmapData.title || `8-Week Roadmap for ${roleTitle}`,
                steps: formattedSteps,
                user: { connect: { id: user.userId } },
            },
        });
        // 12. Update User targetRole for backward compatibility
        await prisma_1.prisma.user.update({
            where: { id: user.userId },
            data: { targetRole: roleTitle },
        });
        res.status(201).json({
            success: true,
            resume,
            jobTarget: {
                ...jobTarget,
                jobReadinessScore,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.upload = upload;
// POST /api/resume/parse/:resumeId
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
        console.log("Resume URL:", resume.fileUrl);
        console.log("STEP 5: Downloading resume from Cloudinary");
        const response = await fetch(resume.fileUrl);
        console.log("Cloudinary Status:", response.status);
        console.log("Cloudinary Status Text:", response.statusText);
        console.log("Cloudinary Headers:", Object.fromEntries(response.headers.entries()));
        if (!response.ok) {
            throw new Error(`Failed to download resume. Status: ${response.status}`);
        }
        console.log("STEP 6: Download successful");
        const buffer = Buffer.from(await response.arrayBuffer());
        console.log("Buffer size:", buffer.length);
        console.log("First 20 bytes:", buffer.subarray(0, 20).toString());
        console.log("Buffer size:", buffer.length);
        console.log("First 20 bytes:", buffer.subarray(0, 20).toString());
        const extractedText = await (0, resume_service_1.extractTextFromBuffer)(buffer, "resume.pdf");
        console.log("Extracted text:", extractedText.substring(0, 500));
        const parsed = (0, resume_service_1.parseResumeText)(extractedText);
        console.log("PARSED DATA:");
        console.log(JSON.stringify(parsed, null, 2));
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
// GET /api/resume/me - fetch current user's resume (first one)
const getMyResume = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const resume = await prisma_1.prisma.resume.findFirst({ where: { userId: user.userId } });
        if (!resume) {
            res.status(404).json({ success: false, message: "Resume not found" });
            return;
        }
        res.status(200).json({ success: true, resume });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyResume = getMyResume;
//# sourceMappingURL=resume.controller.js.map