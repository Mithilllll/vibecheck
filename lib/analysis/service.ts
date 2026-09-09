import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? ""
);

export async function analyzeContent(
  prompt: string,
  imageBuffer: Buffer,
  mimeType: string
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = gemini.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    {
      text: prompt,
    },
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    },
  ]);

  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}