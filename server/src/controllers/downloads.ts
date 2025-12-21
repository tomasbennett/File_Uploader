import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { prisma } from "../db/prisma";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { fetchSupaBaseFile } from "../services/FetchSupaBaseFile";
import { IsUsersFolder } from "../services/IsUsersFolder";

export const router = Router();




router.get("/public/:sharedNodeFileId", ensureAuthentication, async (req: Request<{ sharedNodeFileId: string }>, res: Response, next: NextFunction) => {
    const { sharedNodeFileId } = req.params;

    const sharedNode = await prisma.sharedNode.findUnique({
        where: {
            id: sharedNodeFileId,
            fileId: {
                not: null
            }
        },
        include: {
            file: true
        }
    });

    if (!sharedNode) {
        return res.status(404).json({
            message: "Shared file not found!!!",
            ok: false,
            status: 404
        });
    }

    const file = await fetchSupaBaseFile(sharedNode.fileId!);

    const errorResult = APIErrorSchema.safeParse(file);
    if (errorResult.success) {

        const apiError = file as ICustomErrorResponse;
        return res.status(apiError.status).json(apiError);
    }


    const blobFile = file as Blob;
    const arrayBuffer = await blobFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", blobFile.type);
    res.setHeader("Content-Length", blobFile.size.toString());
    res.setHeader("Content-Disposition", `attachment; filename="${sharedNode.file!.filename}"`);

    res.send(buffer);


});



router.get("/private/:fileId", ensureAuthentication, async (req: Request<{ fileId: string }>, res: Response, next: NextFunction) => {
    const { fileId } = req.params;


    const file = await prisma.files.findUnique({
        where: {
            id: fileId,
        },
        include: {
            parentFolder: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (!file) {
        return res.status(404).json({
            message: "File not found!!!",
            ok: false,
            status: 404
        });
    }

    const isUsersFile = await IsUsersFolder(file.parentFolderId, req.user!);

    if (isUsersFile instanceof Error) {
        return res.status(500).json({
            message: isUsersFile.message,
            ok: false,
            status: 500
        });
    }

    const errorResult = APIErrorSchema.safeParse(isUsersFile);
    if (errorResult.success) {
        const apiError = isUsersFile as ICustomErrorResponse;
        return res.status(apiError.status).json(apiError);
    }


    const supabaseFile = await fetchSupaBaseFile(file.supabaseFileId);

    const errorResultFile = APIErrorSchema.safeParse(supabaseFile);
    if (errorResultFile.success) {
        const apiError = supabaseFile as ICustomErrorResponse;
        return res.status(apiError.status).json(apiError);
    }



    const blobFile = supabaseFile as Blob;
    const arrayBuffer = await blobFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", blobFile.type);
    res.setHeader("Content-Length", blobFile.size.toString());
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

    return res.send(buffer);

});