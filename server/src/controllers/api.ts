import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { prisma } from "../db/prisma";
import { ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { IFolderFileResponse } from "../../../shared/models/IFolderFileResponse";
import { getRecursiveParentFolders } from "../services/RecursiveParentFolders";


export const router = Router();



router.get(
    "/folder/:pathId",
    ensureAuthentication,
    async (req: Request<{ pathId: string }>, res: Response<ICustomErrorResponse | IFolderFileResponse>, next: NextFunction) => {
        const { pathId } = req.params;

        try {

            const reqUser = req.user!;

            const folder = await prisma.folder.findUnique({
                where: {
                    id: pathId,
                    owner: { id: reqUser.id },
                },
                include: {
                    subFolders: true,
                    files: true,
                },
            });

            if (!folder) {
                const error: ICustomErrorResponse = {
                    ok: false,
                    status: 404,
                    message: "Folder not found or wrong user account used"
                };
                return res.status(404).json(error);

            }

            const parentFolders = await getRecursiveParentFolders(folder.id);

            const folderFileResponse: IFolderFileResponse = {
                cwdFiles: folder.files.map((file) => ({
                    id: file.id,
                    name: file.filename,
                    parentFolderId: file.parentFolderId,
                    fileType: file.filetype,
                    size: file.filesize,
                    createdAt: file.uploadedAt,

                })),
                cwdFolders: folder.subFolders.map((subFolder) => ({
                    id: subFolder.id,
                    name: subFolder.name,
                    parentId: subFolder.parentFolderId,
                })),
                parentFolders: parentFolders.reverse(),
            }

            return res.status(200).json(folderFileResponse);



        } catch (error) {
            next(error);

        }
    });