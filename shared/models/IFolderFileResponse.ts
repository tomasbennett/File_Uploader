import z from "zod";
import { DateFromStringSchema } from "./IDate";


export const FolderResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().nullable(),
    createdAt: DateFromStringSchema
});

export type IFolderResponse = z.infer<typeof FolderResponseSchema>;



export const FileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    parentFolderId: z.string(),
    createdAt: DateFromStringSchema,
    size: z.number(),
    fileType: z.string()
});



export type IFileResponse = z.infer<typeof FileResponseSchema>;









export const FolderFileResponseSchema = z.object({
    cwdFiles: z.array(FileResponseSchema, {
        message: "cwdFiles must be an array of FileResponseSchema!!!",
    }),
    cwdFolders: z.array(FolderResponseSchema, {
        message: "cwdFolders must be an array of FolderResponseSchema!!!",
    }),
    parentFolders: z.array(FolderResponseSchema, {
        message: "parentFolders must be an array of FolderResponseSchema!!!",
    }),

});

export type IFolderFileResponse = z.infer<typeof FolderFileResponseSchema>;