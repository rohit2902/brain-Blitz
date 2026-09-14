import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRoutes from './routes/auth.route.js';
import morgan from "morgan";
import chatRoute from './routes/chat..route.js';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.middleware.js';
import passport from "passport";
import { setupSwagger } from "./config/swagger.config.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from "url";


dotenv.config();

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Custom Logger for Request & Response Payloads
app.use((req, res, next) => {
  // Log Request
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "***HIDDEN***";
    console.log(`\n➡️  [REQ] ${req.method} ${req.url}`, safeBody);
  } else {
    console.log(`\n➡️  [REQ] ${req.method} ${req.url}`);
  }

  // Intercept Response
  const originalJson = res.json;
  res.json = function (body) {
    console.log(`⬅️  [RES] ${req.method} ${req.url}`, body);
    return originalJson.call(this, body);
  };

  next();
});

app.use(cookieParser());
app.use(helmet()); 
app.use(passport.initialize());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));


const allowedOrigins = [
  process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : null,
  'https://brain-blitz-1.onrender.com',
  'http://localhost:5174',
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
     
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); 
    },
    credentials: true,
    exposedHeaders: ["X-Chat-Id", "X-Chat-Title"],
  })
);



// Routes
app.use('/api/auth', AuthRoutes);

app.use("/api/chats",chatRoute)

// Swagger API Documentation
setupSwagger(app);
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
     callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
 
    done(null, profile);
  }
));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to BrainBlitz API" });
});

// Handle undefined routes
// app.use("*name", (req, res) => {
//   res.status(404).json({ success: false, message: "API Route Not Found" });
// });

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route Not Found" });
});

app.use(errorHandler);

app.set("etag", false);

export default app;