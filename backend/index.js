import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const {
  PORT,
  FRONTEND_URL,
  NODE_ENV = "development"
} = process.env;

const app = express();

// CORS configuration
const whitelist = [FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin && NODE_ENV === "development") {
      return callback(null, true);
    }
    
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Use routes
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: "CORS Error",
      message: "Request not allowed from this origin"
    });
  }
  
  res.status(500).json({
    error: "Internal Server Error",
    message: NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// Create HTTPS server
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("../certs/localhost-key.pem"),
    cert: fs.readFileSync("../certs/localhost.pem"),
  },
  app
);

// Start server
httpsServer.listen(PORT, () => {
  console.log(`🚀 HTTPS Backend running at https://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
});