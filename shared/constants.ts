export const minUsernamePasswordLength: number = 1;
export const maxUsernamePasswordLength: number = 30;

export const usernamePasswordRegex: RegExp = /^[a-zA-Z0-9_]+$/;


import { z } from "zod";


export const usernamePasswordSchema = z.string()
    .min(minUsernamePasswordLength, { message: `Must be at least ${minUsernamePasswordLength} characters long.` })
    .max(maxUsernamePasswordLength, { message: `Must be at most ${maxUsernamePasswordLength} characters long.` })
    .regex(usernamePasswordRegex, { message: "Can only contain letters, numbers, or underscores." });


export type IUsernamePassword = z.infer<typeof usernamePasswordSchema>;



export const rootFolderName: string = "root";