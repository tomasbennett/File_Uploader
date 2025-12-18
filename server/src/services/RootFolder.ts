import { IFolderWithOwner } from "../models/IFolderWithOwner";
import { getRecursiveParentFolders } from "./RecursiveParentFolders";

export async function getRootFolder(
    folderId: string
): Promise<IFolderWithOwner | null> {
    const parentFolders: IFolderWithOwner[] = await getRecursiveParentFolders(
        folderId
    );

    const length: number = parentFolders.length;

    if (length === 0) {
        return null;
    }

    return parentFolders[length - 1];

}