import z from "zod";
import { NumberFromStringSchema } from "./INumber";

export const ShareDurationSchema = z.object({
    duration: NumberFromStringSchema,
});


export type IShareDuration = z.infer<typeof ShareDurationSchema>;






export const SharedFolderTimeResponseSchema = z.object({
    server_modified: z.string().optional().nullable(),
    client_modified: z.string().optional().nullable(),
});


export type ISharedFolderTimeResponse = z.infer<typeof SharedFolderTimeResponseSchema>;