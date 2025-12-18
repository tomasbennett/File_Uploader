

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import session from "express-session";
import passport from "passport";


import { router as signInRouter } from "./controllers/sign-in";
import { router as authRouter } from "./controllers/auth";
import { router as apiRouter } from "./controllers/api";
import { router as publicFoldersRouter } from "./controllers/public";


import "./passport/passportConfig";
import { environment } from "../../shared/constants";






dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use(cors({
  origin: environment === "PROD" ? true : allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../client/dist")));



app.use(session({
  name: "session-id",
  secret: process.env.COOKIE_SECRET_NAME || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
}));



app.use(passport.initialize());
app.use(passport.session());












app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {

  if (req.headers.accept && req.headers.accept === "application/json") {
    return next();

  } else {
    return res.sendFile(path.join(__dirname, "../../client/dist/index.html"));

  }

});

app.use("/sign-in", signInRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/api", publicFoldersRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
