import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import upload from "../supabase/multer";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { supabase } from "../supabase/client";
import { prisma } from "../db/prisma";
import { INewFileResponse } from "../../../shared/models/INewFileResponse";

// import dotenv from "dotenv";
import { IsUsersFolder } from "../services/IsUsersFolder";
// import { is } from "zod/v4/locales";
// dotenv.config({
//     path: "../../.env"
// });


export const router = Router();



router.post("/files/upload", ensureAuthentication, upload.single("file"), async (req: Request<{}, {}, { currentFolderId: string | undefined }>, res: Response<ICustomErrorResponse | INewFileResponse>, next: NextFunction) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "No file uploaded"
            });
        }



        const { originalname, mimetype, size, buffer } = file;
        const currentFolderId = req.body.currentFolderId;

        if (!currentFolderId) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "No folder ID provided!!!"
            });
        }

        const isUsersFolder = await IsUsersFolder(currentFolderId, req.user);

        if (isUsersFolder instanceof Error) {
            return res.status(500).json({
                ok: false,
                status: 500,
                message: isUsersFolder.message
            });
        }


        const errorIsUsersFolder = APIErrorSchema.safeParse(isUsersFolder);
        if (errorIsUsersFolder.success) {
            return res.status(errorIsUsersFolder.data.status).json(errorIsUsersFolder.data);
        }






        const fileExt = originalname.split(".").pop();
        const storagePath = `${currentFolderId}/${crypto.randomUUID()}.${fileExt}`;

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_STORAGE_BUCKET_NAME || "uploads")
            .upload(storagePath, buffer, {
                contentType: mimetype,
                upsert: false
            });

        if (error) throw error;




        const newFilePrisma = await prisma.files.create({
            data: {
                filename: originalname,
                filesize: size,
                filetype: mimetype,
                parentFolderId: currentFolderId,
                uploadedAt: new Date(),
                supabaseFileId: storagePath,
            }
        });




        return res.status(201).json({
            ok: true,
            status: 201,
            file: {
                id: newFilePrisma.id,
                name: newFilePrisma.filename,
                size: newFilePrisma.filesize,
                fileType: newFilePrisma.filetype,
                parentFolderId: newFilePrisma.parentFolderId,
                createdAt: newFilePrisma.uploadedAt,
            },
            message: "File uploaded successfully"
        });




    } catch (error) {
        next(error);

    }

});