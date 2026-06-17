const pdfParse = require("pdf-parse");
import mammoth from "mammoth";



export interface ParsedResumeData {
  name: string;
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
}

const skillKeywords = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "GraphQL",
  "REST",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Python",
  "Java",
  "C#",
  "Git",
  "SQL",
  "NoSQL",
  "HTML",
  "CSS",
  "Tailwind",
  "Redux",
  "Prisma",
  "Cloudinary",
  "Google Cloud",
  "Azure",
  "Machine Learning",
  "TensorFlow",
  "PyTorch",
];

const normalizeText = (text: string): string => text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();

const getSection = (text: string, titlePatterns: string[]): string[] => {
  const lines = normalizeText(text).split(/\n+/).map((line) => line.trim());
  const lower = lines.map((line) => line.toLowerCase());
  const startIndex = lower.findIndex((line) => titlePatterns.some((pat) => line.includes(pat)));

  if (startIndex === -1) {
    return [];
  }

  const sectionLines: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (!lines[i]) break;
    if (/^(education|experience|skills|projects|certifications|summary|work experience|professional experience|technical skills)/i.test(lines[i])) {
      break;
    }
    sectionLines.push(lines[i]);
  }

  return sectionLines.map((line) => line.replace(/^[-•*\s]+/, "")).filter(Boolean);
};

// const pdfParse = require("pdf-parse");
// import mammoth from "mammoth";

export const extractTextFromBuffer = async (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  console.log("Parsing file name:", fileName);
  console.log("Buffer length:", buffer.length);

  const isDocx = fileName.toLowerCase().endsWith(".docx");

  if (isDocx) {
    try {
      console.log("Detected DOCX file extension. Trying DOCX parser first...");
      const result = await mammoth.extractRawText({ buffer });
      console.log("DOCX text length:", result.value?.length);
      if (result.value) {
        return result.value;
      }
    } catch (err) {
      console.warn("DOCX PARSE ERROR, falling back to PDF parser:", err);
    }
  } else {
    try {
      console.log("Trying PDF parser...");
      const pdfData = await pdfParse(buffer);
      console.log("PDF text length:", pdfData.text?.length);
      if (pdfData.text) {
        return pdfData.text;
      }
    } catch (err) {
      console.warn("PDF PARSE ERROR, falling back to DOCX parser:", err);
    }
  }

  // Fallbacks
  if (isDocx) {
    try {
      console.log("DOCX parsing failed, running PDF parser fallback...");
      const pdfData = await pdfParse(buffer);
      if (pdfData.text) {
        return pdfData.text;
      }
    } catch (err) {
      console.error("PDF fallback parser failed:", err);
    }
  } else {
    try {
      console.log("PDF parsing failed, running DOCX parser fallback...");
      const result = await mammoth.extractRawText({ buffer });
      if (result.value) {
        return result.value;
      }
    } catch (err) {
      console.error("DOCX fallback parser failed:", err);
    }
  }

  throw new Error("Unsupported resume format or parsing failed for both PDF and DOCX");
};

export const parseResumeText = (text: string): ParsedResumeData => {
  const normalized = normalizeText(text);
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  const name = lines.length > 0 ? lines[0] : "Unknown";

  const skillsSection = getSection(normalized, ["skills", "technical skills", "core competencies"]);
  const educationSection = getSection(normalized, ["education", "academic", "degree"]);
  const projectsSection = getSection(normalized, ["projects", "project experience"]);
  const experienceSection = getSection(normalized, ["experience", "work experience", "professional experience", "employment"]);

  const skills = new Set<string>();
  const allText = normalized.toLowerCase();
  skillKeywords.forEach((keyword) => {
    if (allText.includes(keyword.toLowerCase()) || skillsSection.some((line) => line.toLowerCase().includes(keyword.toLowerCase()))) {
      skills.add(keyword);
    }
  });

  if (skillsSection.length > 0) {
    skillsSection.forEach((line) => {
      const parts = line.split(/[,;•\-]/).map((part) => part.trim());
      parts.forEach((part) => {
        if (part.length > 1) {
          skills.add(part);
        }
      });
    });
  }

  return {
    name,
    skills: Array.from(skills).slice(0, 30),
    education: educationSection,
    projects: projectsSection,
    experience: experienceSection,
  };
};

export const extractSkillsFromText = (text: string): string[] => {
  const normalized = normalizeText(text).toLowerCase();
  const found = new Set<string>();
  skillKeywords.forEach((keyword) => {
    if (normalized.includes(keyword.toLowerCase())) {
      found.add(keyword);
    }
  });

  return Array.from(found);
};
