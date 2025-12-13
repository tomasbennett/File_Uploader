import { Folder } from "@prisma/client";
import { prisma } from "../db/prisma";
import { IFolderResponse } from "../../../shared/models/IFolderFileResponse";

export async function getRecursiveParentFolders(
    folderId: string
): Promise<IFolderResponse[]> {
    
    try {
        const parentFolders: IFolderResponse[] = [];
        let currentFolderId: string | null = folderId;
    
        while (currentFolderId !== null) {
            const currentFolder: Folder | null = await prisma.folder.findUnique({
                where: { id: currentFolderId },
                select: { id: true, name: true, parentFolderId: true }
            });
    
            if (!currentFolder) {
                break;
            }
    
            parentFolders.push({
                id: currentFolder.id,
                name: currentFolder.name,
                parentId: currentFolder.parentFolderId
            });
    
            currentFolderId = currentFolder.parentFolderId;
    
        }
    
        return parentFolders;

    } catch (error) {
        throw error;

    }
}
