import z from "zod";
import { NumberFromStringSchema } from "./INumber";

export const ShareDurationSchema = z.object({
    duration: NumberFromStringSchema,
});


export type IShareDuration = z.infer<typeof ShareDurationSchema>;






export const SharedFolderTimeResponseSchema = z.object({
    duration: NumberFromStringSchema,
    folderId: z.string({ message: "Folder ID is required and needs to be a string!!!" }),
});


export type ISharedFolderTimeResponse = z.infer<typeof SharedFolderTimeResponseSchema>;