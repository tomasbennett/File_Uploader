import z from "zod";


export const minFolderNameLength: number = 1;
export const maxFolderNameLength: number = 30;
export const newFolderRegex: RegExp = /^[a-zA-Z0-9_!]+$/;


export const folderStringErrorMessage: string = "A new folder name must be a string!!!";
export const folderMinErrorMessage: string = `A new folders name must be at least ${minFolderNameLength} character(s) long!!!`;
export const folderMaxErrorMessage: string = `A new folders name must be at most ${maxFolderNameLength} character(s) long!!!`;
export const folderRegexErrorMessage: string = `Your folders name contains restricted characters!!!`;



const FolderNameSchema = z.string({ message: folderStringErrorMessage })
    .min(minFolderNameLength, { message: folderMinErrorMessage })
    .max(maxFolderNameLength, { message: folderMaxErrorMessage })
    .regex(newFolderRegex, { message: folderRegexErrorMessage })


export const NewFolderFormSchema = z.object({
    folderName: FolderNameSchema
});

export type INewFolderForm = z.infer<typeof NewFolderFormSchema>;


export const NewFolderSchema = z.object({
    folderName: FolderNameSchema,
    parentId: z.string().nullable()
});



export type INewFolderSubmittable = z.infer<typeof NewFolderSchema>;