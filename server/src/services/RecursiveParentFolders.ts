import { Folder, Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { IFolderResponse } from "../../../shared/models/IFolderFileResponse";

type IFolderWithOwner = Prisma.FolderGetPayload<{
    include: {

        owner: true
    }
}>


export async function getRecursiveParentFolders(
    folderId: string | null
): Promise<IFolderWithOwner[]> {

    try {
        const parentFolders: IFolderWithOwner[] = [];
        let currentFolderId: string | null = folderId;

        while (currentFolderId !== null) {
            const currentFolder: IFolderWithOwner | null = await prisma.folder.findUnique({
                where: { id: currentFolderId },
                include: {
                    owner: true
                }
                // select: { id: true, name: true, parentFolderId: true },
            });
        
            if (!currentFolder) break;
        
            parentFolders.push({
                id: currentFolder.id,
                name: currentFolder.name,
                parentFolderId: currentFolder.parentFolderId,
                owner: currentFolder.owner,
                createdAt: currentFolder.createdAt
            });
        
            currentFolderId = currentFolder.parentFolderId;
        }
        

        return parentFolders;

    } catch (error) {
        throw error;

    }
}
