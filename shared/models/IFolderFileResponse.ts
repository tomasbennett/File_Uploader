import z from "zod";


const FolderResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().nullable()
});


const FileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    parentFolderId: z.string().nullable(),
    createdAt: z.string(),
    size: z.number(),
    fileType: z.string()
});


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