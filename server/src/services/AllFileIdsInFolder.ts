import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { prisma } from "../db/prisma";
import { deleteSupaBaseFile } from "./DeleteFileSupabase";

export async function deleteAllFileIdsInFolder(
    folderId: string
): Promise<void | ICustomErrorResponse> {


    try {

        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: {
                files: true,
                subFolders: true
            }
        });

        if (!folder) {
            return {
                ok: false,
                status: 404,
                message: "One of the folders was not found!!!"
            };
        }

        for (const file of folder.files) {
            const deleteFileResult = await deleteSupaBaseFile(file.id);
            if (deleteFileResult.ok === false) {
                return deleteFileResult;
            }
        }

        for (const subFolder of folder.subFolders) {
            const deleteSubFolderResult = await deleteAllFileIdsInFolder(subFolder.id);

            const customErrorResult = APIErrorSchema.safeParse(deleteSubFolderResult);
            if (customErrorResult.success) {
                return customErrorResult.data;
            }
        }


        return;
    } catch (error) {
        if (error instanceof Error) {
            return {
                ok: false,
                status: error.cause as number || 500,
                message: error.message
            };
        }

        return {
            ok: false,
            status: 500,
            message: "Unknown error occurred whilst deleting all file IDs in folder!!!"
        };
    }
}