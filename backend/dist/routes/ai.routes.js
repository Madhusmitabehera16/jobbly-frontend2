"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const gemini_service_1 = require("../services/gemini.service");
// import cloudinary from "../config/cloudinary";
const router = (0, express_1.Router)();
// Legacy endpoints
router.post("/analyze/resume/:resumeId", auth_middleware_1.authenticate, ai_controller_1.analyzeResume);
router.post("/skill-gap/create", auth_middleware_1.authenticate, ai_controller_1.createSkillGap);
router.post("/roadmap/generate", auth_middleware_1.authenticate, ai_controller_1.generateRoadmap);
router.post("/resume/improve", auth_middleware_1.authenticate, ai_controller_1.improveResume);
router.post("/interview/start", auth_middleware_1.authenticate, ai_controller_1.startInterview);
router.post("/interview/evaluate", auth_middleware_1.authenticate, ai_controller_1.evaluateInterview);
router.post("/jobs/match", auth_middleware_1.authenticate, ai_controller_1.matchJobs);
router.get("/admin/analytics", auth_middleware_1.authenticate, ai_controller_1.getAnalytics);
router.get("/test-gemini", async (req, res) => {
    const result = await (0, gemini_service_1.generateGeminiResponse)("Say hello in one sentence");
    res.json({ result });
});
router.get("/test-gemini", async (_req, res) => {
    try {
        const result = await (0, gemini_service_1.generateGeminiResponse)("Say hello");
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
// Dashboard endpoints for hooks
router.post("/analytics", auth_middleware_1.authenticate, ai_controller_1.getUserAnalytics);
router.post("/resume-analysis", auth_middleware_1.authenticate, ai_controller_1.getResumeAnalysisData);
router.post("/skill-gap", auth_middleware_1.authenticate, ai_controller_1.getSkillGapData);
router.post("/roadmap", auth_middleware_1.authenticate, ai_controller_1.getRoadmapData);
router.post("/interview", auth_middleware_1.authenticate, ai_controller_1.getInterviewData);
router.post("/job-matching", auth_middleware_1.authenticate, ai_controller_1.getJobMatchingData);
router.post("/improvements", auth_middleware_1.authenticate, ai_controller_1.getImprovementsData);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map