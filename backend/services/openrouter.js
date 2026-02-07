import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "OPENROUTER KEY LOADED:",
  process.env.OPENROUTER_API_KEY ? "YES" : "NO"
);

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "DevMentor AI",
  },
});

export default client;
