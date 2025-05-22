import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config(); // Load environment variables from .env file

const apiKey = process.env.API_KEY_1; // Use the API key from .env
const ai = new GoogleGenAI({ apiKey });

export const main = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating response. Please try again.";
  }
};
