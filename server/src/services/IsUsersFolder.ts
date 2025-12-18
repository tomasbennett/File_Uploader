import { User } from "@prisma/client";
import { ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { prisma } from "../db/prisma";
import { getRootFolder } from "./RootFolder";

export async function IsUsersFolder(
    folderId: string | null,
    user: User | undefined
): Promise<ICustomErrorResponse | Error | true> {
    try {

        if (folderId === null) {
            const noFolderId: ICustomErrorResponse = {
                ok: false,
                message: "There was no folderId for the inserted folder!!! Expected string, received null!!!",
                status: 400
            }
            return noFolderId;
        }

        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId
            },
            include: {
                owner: true
            }
        });

        if (!folder) {
            const noFolder: ICustomErrorResponse = {
                ok: false,
                message: "There was no folder found for the inserted folderId!!!",
                status: 400
            }
            return noFolder;
        }


        const findRootFolder = await getRootFolder(folder.id);
        const rootFolder = findRootFolder || folder;





        if (!(rootFolder.owner?.id) || !(user?.id)) {
            const unauthorisedError: ICustomErrorResponse = {
                ok: false,
                message: "Unauthorised content!!!",
                status: 403
            }
            return unauthorisedError
        }


        if (rootFolder.owner.id !== user.id) {
            const unauthorisedError: ICustomErrorResponse = {
                ok: false,
                message: "Unauthorised content!!!",
                status: 403
            }
            return unauthorisedError;
        }

        return true;


    } catch (error) {
        if (error instanceof Error) {
            return error;
        }

        throw error;


    }
}