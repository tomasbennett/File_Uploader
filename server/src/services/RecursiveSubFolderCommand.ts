import { prisma } from "../db/prisma";


type IFolderIdsWithParent = {
    folderId: string,
    parentFolderId: string | null
}[];

type IFileIdsWithParent = {
    fileId: string,
    parentFolderId: string
}[];


type FolderTreeIds = {
    folderIds: IFolderIdsWithParent,
    fileIds: IFileIdsWithParent;
};

export async function allSubfoldersRecursivelyCommand(
    rootFolderId: string,
    parentFolderId: string | null
): Promise<FolderTreeIds | Error> {

    const folderQueue: IFolderIdsWithParent = [{ folderId: rootFolderId, parentFolderId: parentFolderId }]
    const folderIds: IFolderIdsWithParent = [];
    const fileIds: IFileIdsWithParent = [];

    try {
        while (folderQueue.length > 0) {
            const currentFolderId = folderQueue.shift()!;

            folderIds.push({ folderId: currentFolderId.folderId, parentFolderId: currentFolderId.parentFolderId });

            const files = await prisma.files.findMany({
                where: { parentFolderId: currentFolderId.folderId },
                select: { id: true, parentFolderId: true }
            });

            for (const file of files) {
                fileIds.push({
                    fileId: file.id,
                    parentFolderId: file.parentFolderId
                });
            }

            const subfolders = await prisma.folder.findMany({
                where: { parentFolderId: currentFolderId.folderId },
                select: { id: true, parentFolderId: true }
            });

            for (const subfolder of subfolders) {
                folderQueue.push({
                    folderId: subfolder.id,
                    parentFolderId: subfolder.parentFolderId
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
