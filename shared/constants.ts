export const environment: "DEV" | "PROD" = "PROD";



export const minUsernamePasswordLength: number = 1;
export const maxUsernamePasswordLength: number = 30;

export const usernamePasswordRegex: RegExp = /^[a-zA-Z0-9_!]+$/;


import { z } from "zod";


export const usernamePasswordSchema = z.string()
    .min(minUsernamePasswordLength, { message: `Must be at least ${minUsernamePasswordLength} characters long.` })
    .max(maxUsernamePasswordLength, { message: `Must be at most ${maxUsernamePasswordLength} characters long.` })
    .regex(usernamePasswordRegex, { message: "Can only contain letters, numbers, exclamation points or underscores." });


export type IUsernamePassword = z.infer<typeof usernamePasswordSchema>;


export const loginFormSchema = z.object({
    username: usernamePasswordSchema,
    password: usernamePasswordSchema
});

export type ILoginForm = z.infer<typeof loginFormSchema>;



export const SignInErrorSchema = z.object({
    message: z.string(),
    inputType: z.enum(["username", "password", "root"])
});

export type ISignInError = z.infer<typeof SignInErrorSchema>;






export const rootFolderName: string = "root";



export const maxFileSizeInBytes = 50 * 1024 * 1024; // 50 MB

export const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain"
];


// export const backendUrl = "http://localhost:3000";
export const backendUrl = "";