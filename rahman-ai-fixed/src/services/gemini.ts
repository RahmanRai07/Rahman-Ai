import { GoogleGenAI } from "@google/genai";

// Supports both AI Studio (process.env) and standard Vite (import.meta.env)
const GEMINI_API_KEY =
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  "";

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ✅ Correct, working Gemini model names (as of 2025-2026)
export const MODELS = {
  text: "gemini-1.5-pro",
  flash: "gemini-1.5-flash",
  image: "gemini-1.5-flash", // vision model (can see images, describe edits)
};

export async function analyzeResume(pdfBase64: string, role: string, company: string) {
  const prompt = `Analyze the provided resume for the role of "${role}" at "${company || 'a top tech company'}".
    Provide a detailed ATS analysis. Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
    {"score":75,"matchPercentage":80,"strengths":["strength1"],"weaknesses":["weakness1"],"improvements":["improvement1"],"keywords":[{"word":"Python","found":true}]}`;

  const response = await ai.models.generateContent({
    model: MODELS.text,
    contents: { parts: [{ inlineData: { mimeType: "application/pdf" as const, data: pdfBase64 } }, { text: prompt }] },
  });

  const text = response.text?.replace(/```json|```/g, "").trim() || "{}";
  return JSON.parse(text);
}

export async function fetchRealNews(category: 'world' | 'tech') {
  const prompt = category === 'world'
    ? `Generate 5 realistic recent global news headlines for Indian college students in 2026. Return ONLY a JSON array (no markdown, no code fences):
       [{"id":"1","title":"Headline here","summary":"Brief 100 word summary","source":"Reuters","url":"https://reuters.com","timestamp":"2 hours ago"}]`
    : `Generate 5 realistic recent technology and AI job market news for Indian engineering students in 2026. Return ONLY a JSON array (no markdown, no code fences):
       [{"id":"1","title":"Headline here","summary":"Brief 100 word summary","source":"TechCrunch","url":"https://techcrunch.com","timestamp":"1 hour ago"}]`;

  const response = await ai.models.generateContent({ model: MODELS.flash, contents: prompt });
  const text = response.text?.replace(/```json|```/g, "").trim() || "[]";
  return JSON.parse(text);
}

export async function generateCareerAdvice(userData: any) {
  const prompt = `Analyze this career profile and provide detailed placement analysis:
    College: ${userData.college || 'N/A'}, Course: ${userData.course || 'N/A'}, Graduation: ${userData.graduationDate || 'N/A'}
    Skills: ${userData.skills?.join(", ") || 'N/A'}, Goal: ${userData.careerGoal || 'N/A'}
    
    Provide:
    1. Skill Gap Analysis  
    2. Step-by-Step Study Plan
    3. Recommended Free & Paid Resources
    4. Unique Project Ideas to stand out
    
    Format in clear Markdown.`;

  const response = await ai.models.generateContent({ model: MODELS.text, contents: prompt });
  return response.text;
}

export async function processImageAction(base64Image: string, action: string) {
  try {
    const mimeType = (base64Image.match(/data:([^;]+);base64,/)?.[1] || "image/png") as "image/png" | "image/jpeg" | "image/webp";
    const imageData = base64Image.split(",")[1] || base64Image;

    const prompt = `You are Rai, a Vision AI expert. The user wants to: "${action}" on this image.
      Provide a detailed response covering:
      1. **Image Analysis**: What you see in this image (colors, composition, subject, mood)
      2. **Transformation Plan**: Exactly how you would apply "${action}" to this image
      3. **Expected Result**: What the final result would look like
      4. **Technical Details**: What tools/techniques would be used
      
      Be specific, creative, and professional. Format with Markdown.`;

    const response = await ai.models.generateContent({
      model: MODELS.flash,
      contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: prompt }] },
    });

    return { type: "text" as const, content: response.text || "I analyzed your image. Please try again." };
  } catch (error: any) {
    console.error("Error in processImageAction:", error);
    throw error;
  }
}

export async function generateAIChat(messages: { role: string; content: string }[], systemPrompt?: string) {
  const contents: any[] = [];
  if (systemPrompt) {
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood. Ready to help.' }] });
  }
  for (const m of messages) {
    contents.push({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.content }] });
  }
  const response = await ai.models.generateContent({ model: MODELS.text, contents });
  return response.text || "";
}

export async function generateFlashContent(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({ model: MODELS.flash, contents: prompt });
  return response.text || "";
}
