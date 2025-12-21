import z from "zod";
import { FileResponseSchema } from "./IFolderFileResponse";
import { APISuccessSchema } from "./ISuccessResponse";

export const NewFileResponseSchema = APISuccessSchema.extend({
    file: FileResponseSchema
});

export type INewFileResponse = z.infer<typeof NewFileResponseSchema>;