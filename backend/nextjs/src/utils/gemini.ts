import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // or gemini-1.5-pro for higher quality
  generationConfig:{
    maxOutputTokens:400,
  }
});
