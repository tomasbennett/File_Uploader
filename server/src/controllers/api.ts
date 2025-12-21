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
import { IDeletedFilesResponse } from "../../../shared/models/IDeletedFilesResponse";
import { deleteSupaBaseFile } from "../services/DeleteFileSupabase";
import { deleteAllFileIdsInFolder } from "../services/AllFileIdsInFolder";
import { fetchSupaBaseFile } from "../services/FetchSupaBaseFile";


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


router.delete("/folders/:folderId", ensureAuthentication, async (req: Request<{ folderId: string }>, res: Response<ICustomErrorResponse>, next: NextFunction) => {
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





        const folderToDelete = await prisma.folder.findUnique({
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




        const deleteFilesResult = await deleteAllFileIdsInFolder(folderId);
        const customErrorResult = APIErrorSchema.safeParse(deleteFilesResult);
        if (customErrorResult.success) {
            return res.status(customErrorResult.data.status).json(customErrorResult.data);
        }

        const deletedFolder = await prisma.folder.delete({
            where: {
                id: folderId
            }
        });

        return res.sendStatus(204);






    } catch (error) {
        next(error);

    }



});



router.delete("/files/:fileId", ensureAuthentication, async (req: Request<{ fileId: string }>, res: Response<ICustomErrorResponse>, next: NextFunction) => {
    const { fileId } = req.params;


    try {
        const fileToDelete = await prisma.files.findUnique({
            where: {
                id: fileId
            }
        });

        if (!fileToDelete) {
            const fileNotFoundError: ICustomErrorResponse = {
                ok: false,
                status: 404,
                message: "File not found!!!"
            }

            return res.status(404).json(fileNotFoundError);
        }

        const isUsersFolder = await IsUsersFolder(fileToDelete.parentFolderId, req.user);

        if (isUsersFolder instanceof Error) {
            return next(isUsersFolder);
        }

        const errorResult = APIErrorSchema.safeParse(isUsersFolder);

        if (errorResult.success) {
            return res.status(errorResult.data.status).json(errorResult.data);
        }

        // const deletedFile = await prisma.files.delete({
        //     where: {
        //         id: fileId
        //     }
        // });

        // if (!deletedFile) {
        //     const fileNotDeletedError: ICustomErrorResponse = {
        //         ok: false,
        //         status: 500,
        //         message: "File could not be deleted due to server error!!!"
        //     }

        //     return res.status(500).json(fileNotDeletedError);
        // }

        // const updatedFolder = await prisma.folder.findUnique({
        //     where: {
        //         id: deletedFile.parentFolderId
        //     },
        //     include: {
        //         files: true,
        //     }
        // });

        // if (!updatedFolder) {
        //     const folderNotFoundError: ICustomErrorResponse = {
        //         ok: false,
        //         status: 404,
        //         message: "Parent folder not found after file deletion!!!"
        //     }

        //     return res.status(404).json(folderNotFoundError);
        // }


        const deleteResult = await deleteSupaBaseFile(fileId);
        if (!(deleteResult.ok)) {
            return res.status(deleteResult.status).json(deleteResult);
        }


        return res.sendStatus(204);


    } catch (error) {

        next(error);


    }
});




router.get("/private/inline-file/:fileId", ensureAuthentication, async (req: Request<{ fileId: string }>, res: Response, next: NextFunction) => {
    try {
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
    
        if (!file) return res.status(404).send("File not found!");
    
    
        const isUsersFile = await IsUsersFolder(file.parentFolderId, req.user!);
    
        if (isUsersFile instanceof Error) {
            return res.status(500).send(isUsersFile.message);
        }
    
        const errorResult = APIErrorSchema.safeParse(isUsersFile);
        if (errorResult.success) {
            const apiError = isUsersFile as ICustomErrorResponse;
            return res.status(apiError.status).send(apiError.message);
        }
    
        const supabaseFile = await fetchSupaBaseFile(file.supabaseFileId);
    
        const errorResultFile = APIErrorSchema.safeParse(supabaseFile);
        if (errorResultFile.success) {
            return res.status(404).send("File not found in storage: " + errorResultFile.data.message);
        }
    
        const arrayBuffer = await (supabaseFile as Blob).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
    
        const fileBuffer = buffer;
        res.setHeader("Content-Type", (supabaseFile as Blob).type);
        res.setHeader("Content-Length", buffer.length.toString());
        res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
        res.send(fileBuffer);
        
    } catch (error) {
        next(error);
        
    }
    
});


router.get("/public/inline-file/:shareNodeId", ensureAuthentication, async (req: Request<{ shareNodeId: string }>, res: Response, next: NextFunction) => {
    try {
        const { shareNodeId } = req.params;
    
        const sharedNode = await prisma.sharedNode.findUnique({
            where: {
                id: shareNodeId,
                fileId: {
                    not: null
                }
            },
            include: {
                file: true,
            }
        });
    

        if (!sharedNode) {
            return res.status(404).send("Shared node not found!!!");
        }
    

        const file = sharedNode.file;
    
        const supabaseFile = await fetchSupaBaseFile(file!.supabaseFileId);
    

        const errorResultFile = APIErrorSchema.safeParse(supabaseFile);
        if (errorResultFile.success) {
            return res.status(404).send("File not found in storage: " + errorResultFile.data.message);
        }
        
    
        const arrayBuffer = await (supabaseFile as Blob).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
    
        const fileBuffer = buffer;
        res.setHeader("Content-Type", (supabaseFile as Blob).type);
        res.setHeader("Content-Length", buffer.length.toString());
        res.setHeader("Content-Disposition", `inline; filename="${file!.filename}"`);
        res.send(fileBuffer);
        
    } catch (error) {
        next(error);
        
    }
});