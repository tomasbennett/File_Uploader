import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { ISharedFolderTimeResponse, SharedFolderTimeResponseSchema } from "../../../shared/models/ISharedFolderTimeResponse";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { IsUsersFolder } from "../services/IsUsersFolder";
import { prisma } from "../db/prisma";
import { SharedNode } from "@prisma/client";
import { dateFromNow } from "../services/DateFromNow";
import { allSubfoldersRecursivelyCommand } from "../services/RecursiveSubFolderCommand";
import { IGeneratedLinkResponse } from "../../../shared/models/IGeneratedLinkResponse";

export const router = Router();



router.post("/public", ensureAuthentication, async (req: Request<{}, {}, ISharedFolderTimeResponse>, res: Response<ICustomErrorResponse | IGeneratedLinkResponse>, next: NextFunction) => {
    
    const durationResult = SharedFolderTimeResponseSchema.safeParse(req.body);
    if (!durationResult.success) {
        const notCorrectFormat: ICustomErrorResponse = {
            message: "Invalid request form data.",
            ok: false,
            status: 400
        };

        return res.status(400).json(notCorrectFormat);
    }

    // ! CHECK IF FOLDER BELONGS TO USER !!!
    // ! CHECK IF SHARED LINK ALREADY EXISTS !!!

    const isUsersFolder = await IsUsersFolder(durationResult.data.folderId, req.user);


    if (isUsersFolder instanceof Error) {
        return next(isUsersFolder);
    }

    const errorResult = APIErrorSchema.safeParse(isUsersFolder);
    if (errorResult.success) {
        return res.status(errorResult.data.status).json(errorResult.data);
    }



    try {
        const sharedLinkAlreadyExists = await prisma.shared.findUnique({
            where: {
                sharedFolderId: durationResult.data.folderId
            },
            include: {
                sharedRelationships: true
            }
        });
    
        if (sharedLinkAlreadyExists) {
    
            const sharedNode: SharedNode | undefined = sharedLinkAlreadyExists.sharedRelationships.find((sharedNode) => {
    
                if (sharedNode.folderId === durationResult.data.folderId) {
                    return true;
    
                }
    
                return false;
    
            });
    
            if (!sharedNode) {
                const sharedLinkMissingError: ICustomErrorResponse = {
                    message: "Shared link data is corrupted. Shared link should exist with a shared session but doesn't!!!  Please contact support.",
                    ok: false,
                    status: 500
                };
    
                return res.status(500).json(sharedLinkMissingError);
            }
    
    
            const sharedLinkExistsError: ICustomErrorResponse = {
                message: `Folder is already shared publicly!!! Preexisting Generated Link: ${sharedNode.id}`,
                ok: false,
                status: 400
            };
    
            return res.status(400).json(sharedLinkExistsError);
    
        }
    
    
        const expirationDate: Date = dateFromNow(durationResult.data.duration);
    
        const newSharedSession = await prisma.shared.create({
            data: {
                expiresAt: expirationDate,
                sharedFolderId: durationResult.data.folderId,
            }
        });
        
        // ! NOW WE NEED TO GET EACH FILE AND SUBFOLDER CHILD RECURSIVELY AND ADD THEM TO THE SHARENODE TABLE WITH THE NEW SHAREDSESSION ID !!!

        const folder = await prisma.folder.findUnique({
            where: {
                id: durationResult.data.folderId
            },
            include: {
                subFolders: true,
                files: true
            }
        });


        if (!folder) {
            const folderNotFoundError: ICustomErrorResponse = {
                message: "Folder not found when trying to share publicly. Please try again.",
                ok: false,
                status: 404
            };

            return res.status(404).json(folderNotFoundError);
        }


        const subFolderFileIds = await allSubfoldersRecursivelyCommand(folder.id, folder.parentFolderId);

        if (subFolderFileIds instanceof Error) {
            return next(subFolderFileIds);
        }

        subFolderFileIds.folderIds.forEach(async (folderId) => {
            await prisma.sharedNode.create({
                data: {
                    
                    sharedRelationshipId: newSharedSession.id,
                    folderId: folderId.folderId,
                    parentNodeId: folderId.parentFolderId

                }
            });
        });

        subFolderFileIds.fileIds.forEach(async (fileId) => {
            await prisma.sharedNode.create({
                data: {

                    sharedRelationshipId: newSharedSession.id,
                    fileId: fileId.fileId,
                    parentNodeId: fileId.parentFolderId
                    
                }
            });
        })


        const sessionParentNode = await prisma.sharedNode.findUnique({
            where: {
                sharedRelationshipId_folderId: {

                    folderId: folder.id,
                    sharedRelationshipId: newSharedSession.id

                }
            }
        });

        if (!sessionParentNode) {
            const parentNodeMissingError: ICustomErrorResponse = {
                message: "Shared session parent node is missing. Shared link data is corrupted. Please contact support.",
                ok: false,
                status: 500
            };

            return res.status(500).json(parentNodeMissingError);
        }


        const generatedLinkResponse: IGeneratedLinkResponse = {
            ok: true,
            status: 201,
            message: "Folder shared publicly.",
            link: sessionParentNode.id
        };
        return res.status(201).json(generatedLinkResponse);




    } catch (error) {
        return next(error);
        
    }

});
