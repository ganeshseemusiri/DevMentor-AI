import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);


app.get("/", (req, res) => {
  res.send("DevMentor AI backend is running");
});

// Use chat routes
app.use("/", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

