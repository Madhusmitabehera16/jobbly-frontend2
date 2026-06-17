"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
if (!apiKey || apiKey === "dummy_key") {
    console.warn("⚠️ GEMINI_API_KEY not set; AI features will be unavailable.");
}
const generator = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = generator.getGenerativeModel({
    model: modelName,
});
const generateGeminiResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    catch (error) {
        console.error("Error from GoogleGenerativeAI:", error.message || error);
        throw new Error(`Gemini API failed: ${error.message || "Unknown error"}`);
    }
};
exports.generateGeminiResponse = generateGeminiResponse;
//# sourceMappingURL=gemini.service.js.map