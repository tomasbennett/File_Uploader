import { NextFunction, Request, Response } from "express";
import { ISignInError } from "../../../shared/constants";

export function ensureAuthentication(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();

    } else {
        res.redirect("/sign-in/login");

    }
}


export function ensureNotAuthenticated(req: Request, res: Response<ISignInError>, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.status(400).json({ 
            message: "You are already authenticated", inputType: "root" 
        });

    } else {
        return next();

    }
}