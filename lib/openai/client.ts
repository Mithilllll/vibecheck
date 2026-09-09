import OpenAI from "openai";

export let client: OpenAI;

if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  // Mock client for when API key is missing
  client = new OpenAI({ apiKey: "mock-key" });
}