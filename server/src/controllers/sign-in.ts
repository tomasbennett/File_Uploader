import { Router } from "express";
import { Request, Response } from "express";


export const router = Router();


router.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body;


    res.send(`Login attempted for user: ${username}`);
});


router.post("/register", (req: Request, res: Response) => {
    const { username, password } = req.body;


    res.send(`Registration attempted for user: ${username}`);
});