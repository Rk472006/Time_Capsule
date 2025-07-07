const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");

dotenv.config();

const userRoutes    = require("./routes/user");
const messageRoutes = require("./routes/message");

const app = express();

const allowedOrigins = [
  "https://time-capsule-neon.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) =>
      !origin || allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS")),
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.options("*", cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/api/user",     userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_, res) => res.send("🚀 API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
