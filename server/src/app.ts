

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
import { router as downloadRouter } from "./controllers/downloads";


import "./passport/passportConfig";
import { environment } from "../../shared/constants";
import { ICustomErrorResponse } from "../../shared/models/ICustomErrorResponse";






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













app.use("/sign-in", signInRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter, publicFoldersRouter);
// app.use("/api", publicFoldersRouter);
app.use("/download", downloadRouter);

app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {


  // if (req.headers.accept && req.headers.accept === "application/json") {
  //   return next();

  // } else {
  return res.sendFile(path.join(__dirname, "../../client/dist/index.html"));

  // }

});


app.use((err: Error, req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    status: 500,
    ok: false,
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
