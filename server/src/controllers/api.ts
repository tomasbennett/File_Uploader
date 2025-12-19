import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../passport/ensureAuthentication";
import { prisma } from "../db/prisma";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { IFolderFileResponse, IFolderResponse } from "../../../shared/models/IFolderFileResponse";
import { getRecursiveParentFolders } from "../services/RecursiveParentFolders";
import { rootFolderName } from "../../../shared/constants";
import { Folder, Prisma } from "@prisma/client";
import { INewFolderSubmittable, NewFolderSchema } from "../../../shared/models/INewFolderSchema";
import { ICustomSuccessMessage } from "../../../shared/models/ISuccessResponse";
import { getRootFolder } from "../services/RootFolder";
import { IsUsersFolder } from "../services/IsUsersFolder";


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





            const isUsersFolder = await IsUsersFolder(pathId, reqUser);

            if (isUsersFolder instanceof Error) {
                return next(isUsersFolder);
            }

            const errorResult = APIErrorSchema.safeParse(isUsersFolder);
            if (errorResult.success) {
                return res.status(errorResult.data.status).json(errorResult.data);
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
                owner: folder.owner,
                createdAt: folder.createdAt
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
                    createdAt: subFolder.createdAt
                })),
                parentFolders: parentFolders.map((parentFolder) => {
                    return {
                        id: parentFolder.id,
                        name: parentFolder.name,
                        parentId: parentFolder.parentFolderId,
                        createdAt: parentFolder.createdAt
                    }
                }),
            }

            return res.status(200).json(folderFileResponse);



        } catch (error) {
            next(error);

        }
    }
);


router.post("/folders", ensureAuthentication, async (req: Request<{}, {}, INewFolderSubmittable>, res: Response<ICustomErrorResponse | IFolderResponse>, next: NextFunction) => {
    try {
        const request = req.body;



        const result = NewFolderSchema.safeParse(request);
        if (!result.success) {
            const customError: ICustomErrorResponse = {
                ok: false,
                message: result.error.issues[0].message,
                status: 400
            }
            return res.status(400).json(customError);

        }

        // if (result.data.parentId === null) {
        //     const noParentId: ICustomErrorResponse = {
        //         ok: false,
        //         message: "There was no parentId for the inserted folder!!!",
        //         status: 400
        //     }
        //     return res.status(400).json(noParentId);
        // }

        // const parentFolder = await prisma.folder.findUnique({
        //     where: {
        //         id: result.data.parentId
        //     },
        //     include: {
        //         owner: true
        //     }
        // });

        // if (!parentFolder) {
        //     const noParentFolder: ICustomErrorResponse = {
        //         ok: false,
        //         message: "There was no parentId for the inserted folder!!!",
        //         status: 400
        //     }
        //     return res.status(400).json(noParentFolder);
        // }


        // const findRootFolder = await getRootFolder(parentFolder.id);
        // const rootFolder = findRootFolder || parentFolder;





        // if (!(rootFolder.owner?.id) || !(req.user?.id)) {
        //     const unauthorizedError: ICustomErrorResponse = {
        //         ok: false,
        //         message: "Unauthorised content!!!",
        //         status: 403
        //     }
        //     return res.status(403).json(unauthorizedError);
        // }


        // if (rootFolder.owner.id !== req.user.id) {
        //     const unauthorizedError: ICustomErrorResponse = {
        //         ok: false,
        //         message: "Unauthorised content!!!",
        //         status: 403
        //     }
        //     return res.status(403).json(unauthorizedError);
        // }

        const isUsersFolder = await IsUsersFolder(result.data.parentId, req.user);

        if (isUsersFolder instanceof Error) {
            return next(isUsersFolder);
        }


        const errorResult = APIErrorSchema.safeParse(isUsersFolder);
        if (errorResult.success) {
            return res.status(errorResult.data.status).json(errorResult.data);
        }



        //SO I WANT TO SAY: IF THE PARENTFOLDER IS A SHAREDFOLDER THEN: 
        // - THE NEW FOLDER SHOULD ALSO BE A SHARED FOLDER
        // + WE FIND THIS OUT BY CHECKING IF THE PARENTFOLDERID CAN BE FOUND IN THE SHARED FOLDERS TABLE: IF IT CAN BE:
        // - WE TAKE THE NEW FOLDER AND FOREACH TIME THE PARENTFOLDERID IS FOUND IN THE SHARED FOLDERS TABLE WE CREATE A NEW ENTRY IN THE SHARED FOLDERS TABLE WITH THE NEW FOLDER ID
        // ! FIRST: WE CHECK IF THAT CONNECTION WITH SHARED TABLE IS STILL ALIVE AND IF NOT THEN WE DELETE THE ENTIRE CONNECTION
        // ! NOTE: WE WILL HAVE TO DO THIS WHEN GETTING SHARED FOLDERS AS WELL SO THIS ENTIRE PROCESS SHOULD PROBABLY BE A SERVICE FUNCTION
        // ! ACTUALLY: LETS DO THE TWO ABOVE ONLY WHEN GETTING SHARED FOLDERS

        // ! ACTUAL FIRST: WE NEED TO CHECK IF THE PARENT FOLDER IS A SHARED FOLDER OR NOT

        const folder = await prisma.folder.create({
            data: {
                name: result.data.folderName,
                parentFolderId: result.data.parentId,
                createdAt: new Date()
            }
        });

        const sharedFolderConnections = await prisma.sharedNode.findMany({
            where: {
                folderId: result.data.parentId!
            }
        });

        if (sharedFolderConnections.length > 0) {
            //THIS CHECKS FOR HOW MANY SESSIONS THE PARENT FOLDER IS A PART OF AS REMEMBER IT CAN TECHNICALLY BE PART OF MULTIPLE SESSIONS SHARED AT THE SAME TIME
            for (const sharedConnection of sharedFolderConnections) {

                await prisma.sharedNode.create({
                    data: {

                        sharedRelationshipId: sharedConnection.sharedRelationshipId,
                        folderId: folder.id,
                        parentNodeId: sharedConnection.id

                    }
                });
            }
        }


        return res.status(201).json({
            id: folder.id,
            createdAt: folder.createdAt,
            parentId: folder.parentFolderId,
            name: folder.name
        });



    } catch (error) {
        next(error);

    }



});


router.delete("/folders/:folderId", ensureAuthentication, async (req: Request<{ folderId: string }>, res: Response<ICustomErrorResponse | ICustomSuccessMessage>, next: NextFunction) => {
    const { folderId } = req.params;


    try {
        const isUsersFolder = await IsUsersFolder(folderId, req.user);

        if (isUsersFolder instanceof Error) {
            return next(isUsersFolder);
        }


        const errorResult = APIErrorSchema.safeParse(isUsersFolder);
        if (errorResult.success) {
            return res.status(errorResult.data.status).json(errorResult.data);
        }





        const folderToDelete = await prisma.folder.findFirst({
            where: {
                id: folderId
            }
        });

        if (!(folderToDelete?.parentFolderId)) {
            const rootFolderDeleteError: ICustomErrorResponse = {
                ok: false,
                status: 400,
                message: "Root folders can not be deleted!!!"
            }

            return res.status(400).json(rootFolderDeleteError);
        }

        const deletedFolder = await prisma.folder.delete({
            where: {
                id: folderId
            }
        });

        return res.status(204).json({
            ok: true,
            status: 204,
            message: "Folder successfully deleted!!!"
        });






    } catch (error) {
        next(error);

    }



})