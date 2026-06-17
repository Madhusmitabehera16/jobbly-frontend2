import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

if (!apiKey || apiKey === "dummy_key") {
  console.warn("⚠️ GEMINI_API_KEY not set; AI features will be unavailable.");
}

const generator = new GoogleGenerativeAI(apiKey);
const model = generator.getGenerativeModel({
  model: modelName,
});

export const generateGeminiResponse = async (
  prompt: string
): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Error from GoogleGenerativeAI:", error.message || error);
    throw new Error(`Gemini API failed: ${error.message || "Unknown error"}`);
  }
};