import z from "zod";
import { FileResponseSchema } from "./IFolderFileResponse";
import { APISuccessSchema } from "./ISuccessResponse";

export const DeleteFileReponseSchema = APISuccessSchema.extend({
    file: z.array(FileResponseSchema)
});

export type IDeletedFilesResponse = z.infer<typeof DeleteFileReponseSchema>;