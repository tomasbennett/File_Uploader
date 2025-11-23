import { NextFunction, Request, Response } from "express";

export function ensureAuthentication(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();

    } else {
        res.redirect("/sign-in/login");

    }
}


export function ensureNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.redirect("/");

    } else {
        return next();

    }
}