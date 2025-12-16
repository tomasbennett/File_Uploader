import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { prisma } from "../db/prisma";
import { ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { IFolderFileResponse } from "../../../shared/models/IFolderFileResponse";
import { getRecursiveParentFolders } from "../services/RecursiveParentFolders";
import { rootFolderName } from "../../../shared/constants";
import { Folder, Prisma } from "@prisma/client";


export const router = Router();



router.get(
    "/folders/:pathId",
    ensureAuthentication,
    async (req: Request<{ pathId: string }>, res: Response<ICustomErrorResponse | IFolderFileResponse>, next: NextFunction) => {
        let { pathId } = req.params;

        
        try {
            
            const reqUser = req.user!;
            if (pathId === rootFolderName) {
                pathId = reqUser.rootFolderId;

            }

            const folder: Prisma.FolderGetPayload<{
                include: {
                    files: true,
                    subFolders: true,
                    owner: true
                }
            }> | null = await prisma.folder.findUnique({
                where: {
                    id: pathId
                },
                include: {
                    subFolders: true,
                    files: true,
                    owner: true
                }
            });

            if (!folder) {
                const error: ICustomErrorResponse = {
                    ok: false,
                    status: 404,
                    message: "Folder not found!!!"
                };
                return res.status(404).json(error);

            }


            
            const parentFolders = await getRecursiveParentFolders(folder.parentFolderId);
            parentFolders.unshift({
                id: folder.id,
                name: folder.name,
                parentFolderId: folder.parentFolderId,
                owner: folder.owner
            });

            const parentFoldersLength: number = parentFolders.length;

            const rootFolder = parentFolders[parentFoldersLength - 1];

            if (rootFolder.owner?.id === null) {
                const error: ICustomErrorResponse = {
                    ok: false,
                    status: 401,
                    message: "Not logged in!!!"
                };
                return res.status(401).json(error);

            }

            if (rootFolder.owner?.id !== reqUser.id) {
                const error: ICustomErrorResponse = {
                    ok: false,
                    status: 403,
                    message: "Not authorized for this content!!!"
                };
                return res.status(403).json(error);

            }



            // if (parentFoldersLength === 0) {
                

            // }

            // if (reqUser.rootFolderId !== parentFolders[parentFoldersLength - 1].id) {
            //     const error: ICustomErrorResponse = {
            //         ok: false,
            //         status: 403,
            //         message: "Not authorized for this content!!!"
            //     };
            //     return res.status(403).json(error);

            // }




            
            // const folder = await prisma.folder.findUnique({
            //     where: {
            //         id: pathId,
            //         owner: { id: reqUser.id },
            //     },
            //     include: {
            //         subFolders: true,
            //         files: true,
            //     },
            // });

            // if (!folder) {
            //     const error: ICustomErrorResponse = {
            //         ok: false,
            //         status: 404,
            //         message: "Folder not found or wrong user account used"
            //     };
            //     return res.status(404).json(error);

            // }

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
                parentFolders: parentFolders.map((parentFolder) => {
                    return {
                        id: parentFolder.id,
                        name: parentFolder.name,
                        parentId: parentFolder.parentFolderId
                    }
                }),
            }

            return res.status(200).json(folderFileResponse);



        } catch (error) {
            next(error);

        }
    }
);