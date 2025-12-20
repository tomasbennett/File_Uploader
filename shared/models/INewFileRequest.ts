import z from "zod";
import { APISuccessSchema } from "./ISuccessResponse";
import { FileResponseSchema } from "./IFolderFileResponse";


export const NewFileRequestSchema = z.object({
    file: z.instanceof(FileList)
        .refine((fileList) => fileList.length > 0, {
            message: "At least one file must be uploaded.",
        })
        .refine((fileList) => {
            const maxFileSizeInBytes = 50 * 1024 * 1024; // 50 MB
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].size > maxFileSizeInBytes) {
                    return false;
                }
            }
            return true;
        })
        .refine((fileList) => {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf",
                "text/plain",
                "application/zip",
            ];
            for (let i = 0; i < fileList.length; i++) {
                if (!allowedTypes.includes(fileList[i].type)) {
                    return false;
                }
            }
            return true;
        }, {
            message: "One or more files have an unsupported file type.",
        }),
});


export type INewFileRequest = z.infer<typeof NewFileRequestSchema>;





export const NewFileRequestBackendSchema = NewFileRequestSchema.extend({
    parentFolderId: z.string(),
});


export type INewFileRequestBackend = z.infer<typeof NewFileRequestBackendSchema>;





export const NewFileResponseSchema = APISuccessSchema.extend({
    file: FileResponseSchema
});

export type INewFileResponse = z.infer<typeof NewFileResponseSchema>;