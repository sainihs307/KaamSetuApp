import "./config.js";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import express from "express";
import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);



const app = express();

app.use(cors());
app.use(express.json());

// 🔥 THIS IS THE MAIN LINE
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

  

app.listen(8000, () => {
  console.log("Server running on port 8000");
});

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // 🔥 THIS LINE MUST BE THERE
// app.use("/api/auth", authRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
