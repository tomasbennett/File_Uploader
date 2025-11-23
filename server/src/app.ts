import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { router as signInRouter } from "./controllers/sign-in";

import session from "express-session";
import passport from "passport";












dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();
app.use(cors());
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












app.get("/", (req: Request, res: Response, next: NextFunction) => {

  if (req.headers.accept && req.headers.accept === "application/json") {
    return next();

  } else {
    return res.sendFile(path.join(__dirname, "../../client/dist/index.html"));

  }

});

app.use("/sign-in", signInRouter);





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
