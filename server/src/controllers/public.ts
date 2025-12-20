import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { ISharedFolderTimeResponse, SharedFolderTimeResponseSchema } from "../../../shared/models/ISharedFolderTimeResponse";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { IsUsersFolder } from "../services/IsUsersFolder";
import { prisma } from "../db/prisma";
import { SharedNode } from "@prisma/client";
import { dateFromNow, isDateInPast } from "../services/DateFromNow";
import { recursiveSubFolderCommand } from "../services/RecursiveSubFolderCommand";
import { IGeneratedLinkResponse } from "../../../shared/models/IGeneratedLinkResponse";
import { IFileResponse, IFolderFileResponse, IFolderResponse } from "../../../shared/models/IFolderFileResponse";
import { recursiveSharedNodeParent } from "../services/RecursiveSharedNodeParent";

export const router = Router();


router.get("/public/:sharedNodeId", async (req: Request<{ sharedNodeId: string }>, res: Response<ICustomErrorResponse | IFolderFileResponse>, next: NextFunction) => {
    const { sharedNodeId } = req.params;

    try {

        const sharedNode = await prisma.sharedNode.findUnique({
            where: {
                id: sharedNodeId,
                folderId: {
                    not: null
                }
            },
            include: {
                sharedRelationship: true,
                folder: true,
            }
        });

        if (!sharedNode) {
            const sharedNodeNotFoundError: ICustomErrorResponse = {
                message: "Shared link not found!!!",
                ok: false,
                status: 404
            };

            return res.status(404).json(sharedNodeNotFoundError);
        }



        const sessionExpirationDate = sharedNode.sharedRelationship.expiresAt;

        if (isDateInPast(sessionExpirationDate)) {
            const expiredSharedSession = await prisma.shared.delete({
                where: {
                    id: sharedNode.sharedRelationshipId
                }
            });


            const sharedLinkExpiredError: ICustomErrorResponse = {
                message: "Shared link has expired!!!",
                ok: false,
                status: 410
            };

            return res.status(410).json(sharedLinkExpiredError);
        }




        const fileIdsInSharedNode = await prisma.sharedNode.findMany({
            where: {
                parentNodeId: sharedNode.id,
                fileId: {
                    not: null
                }
            },
            include: {
                file: true
            }
        });

        const folderIdsInSharedNode = await prisma.sharedNode.findMany({
            where: {
                parentNodeId: sharedNode.id,
                folderId: {
                    not: null
                }
            },
            include: {
                folder: true
            }
        });


        const sessionParentFolderIds = await recursiveSharedNodeParent(sharedNode.parentNodeId, sharedNode.sharedRelationshipId);
        if (sessionParentFolderIds instanceof Error) {
            return next(sessionParentFolderIds);
        }

        sessionParentFolderIds.unshift({
            id: sharedNode.id,
            parentNodeId: sharedNode.parentNodeId,
            folder: sharedNode.folder
        });


        const cwdFilesShared: IFileResponse[] = fileIdsInSharedNode.map((fileNode) => {
            return {
                id: fileNode.id,
                name: fileNode.file!.filename,
                parentFolderId: fileNode.parentNodeId!,
                createdAt: fileNode.file!.uploadedAt,
                size: fileNode.file!.filesize,
                fileType: fileNode.file!.filetype
            };
        });


        const cwdFoldersShared: IFolderResponse[] = folderIdsInSharedNode.map((folderNode) => {
            return {
                id: folderNode.id,
                name: folderNode.folder!.name,
                parentId: folderNode.parentNodeId,
                createdAt: folderNode.folder!.createdAt
            };
        });


        const parentFoldersShared: IFolderResponse[] = sessionParentFolderIds.map((sharedNodeWithFolder) => {
            return {
                id: sharedNodeWithFolder.id,
                name: sharedNodeWithFolder.folder!.name,
                parentId: sharedNodeWithFolder.parentNodeId,
                createdAt: sharedNodeWithFolder.folder!.createdAt
            };
        });




        const response: IFolderFileResponse = {
            cwdFiles: cwdFilesShared,
            cwdFolders: cwdFoldersShared,
            parentFolders: parentFoldersShared
        };



        return res.status(200).json(response);



    } catch (error) {
        return next(error);

    }



});




router.post("/public", ensureAuthentication, async (req: Request<{}, {}, ISharedFolderTimeResponse>, res: Response<ICustomErrorResponse | IGeneratedLinkResponse | any>, next: NextFunction) => {

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


        const rootSharedNode = await prisma.sharedNode.create({
            data: {
                sharedRelationshipId: newSharedSession.id,
                folderId: folder.id,
                parentNodeId: null
            }
        });








        const subFolderFileIds = await recursiveSubFolderCommand(
            folder.id,
            newSharedSession.id,
            rootSharedNode.id
        );

        // return res.status(200).json(subFolderFileIds);


        if (subFolderFileIds instanceof Error) {
            return next(subFolderFileIds);
        }

        // subFolderFileIds.folderIds.forEach(async (folderId) => {
        //     await prisma.sharedNode.create({
        //         data: {

        //             sharedRelationshipId: newSharedSession.id,
        //             folderId: folderId.folderId,
        //             parentNodeId: folderId.parentSharedNodeId

        //         }
        //     });
        // });

        // subFolderFileIds.fileIds.forEach(async (fileId) => {
        //     await prisma.sharedNode.create({
        //         data: {

        //             sharedRelationshipId: newSharedSession.id,
        //             fileId: fileId.fileId,
        //             parentNodeId: fileId.parentSharedNodeId

        //         }
        //     });
        // })


        // // const sessionParentNode = await prisma.sharedNode.findUnique({
        // //     where: {
        // //         sharedRelationshipId_folderId: {

        // //             folderId: folder.id,
        // //             sharedRelationshipId: newSharedSession.id

        // //         }
        // //     }
        // // });

        // // if (!sessionParentNode) {
        // //     const parentNodeMissingError: ICustomErrorResponse = {
        // //         message: "Shared session parent node is missing. Shared link data is corrupted. Please contact support.",
        // //         ok: false,
        // //         status: 500
        // //     };

        // //     return res.status(500).json(parentNodeMissingError);
        // // }


        const generatedLinkResponse: IGeneratedLinkResponse = {
            ok: true,
            status: 201,
            message: "Folder shared publicly.",
            link: rootSharedNode.id
        };
        return res.status(201).json(generatedLinkResponse);




    } catch (error) {
        return next(error);

    }

});
