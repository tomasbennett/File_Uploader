import { prisma } from "../db/prisma";


type IFolderIdsWithParent = {
    folderId: string,
    parentSharedNodeId: string
}[];

type IFileIdsWithParent = {
    fileId: string,
    parentSharedNodeId: string
}[];


type FolderTreeIds = {
    folderIds: IFolderIdsWithParent,
    fileIds: IFileIdsWithParent;
};

export async function allSubfoldersRecursivelyCommand(
    rootFolderId: string,
    parentSharedNodeId: string
): Promise<FolderTreeIds | Error> {

    const folderQueue: IFolderIdsWithParent = [{ folderId: rootFolderId, parentSharedNodeId: parentSharedNodeId }]
    const folderIds: IFolderIdsWithParent = [];
    const fileIds: IFileIdsWithParent = [];

    try {
        while (folderQueue.length > 0) {
            const currentFolderId = folderQueue.shift()!;

            folderIds.push({ folderId: currentFolderId.folderId, parentSharedNodeId: currentFolderId.parentSharedNodeId });

            const files = await prisma.files.findMany({
                where: { parentFolderId: currentFolderId.folderId },
                select: { id: true }
            });

            for (const file of files) {
                fileIds.push({
                    fileId: file.id,
                    parentSharedNodeId: currentFolderId.parentSharedNodeId
                });
            }

            const subfolders = await prisma.folder.findMany({
                where: { parentFolderId: currentFolderId.folderId },
                select: { id: true }
            });

            for (const subfolder of subfolders) {
                folderQueue.push({
                    folderId: subfolder.id,
                    parentSharedNodeId: currentFolderId.parentSharedNodeId
                });
            }
        }

        return { folderIds, fileIds };

    } catch (error) {
        return error instanceof Error
            ? error
            : new Error("Unknown error while traversing folder tree for sharing nodes!!!");
    }
}
