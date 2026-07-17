import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    contents: "Hello",
  });

  console.log(response.text);
} catch (err) {
  console.log("FULL ERROR:");
  console.dir(err, { depth: null });
}