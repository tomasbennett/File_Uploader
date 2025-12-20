import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";

export const router = Router();



router.post("/files/upload", ensureAuthentication, (req: Request, res: Response, next: NextFunction) => {

    return res.status(501).json({ message: "Not implemented", ok: false, status: 501 });
});