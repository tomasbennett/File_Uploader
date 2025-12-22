import z from "zod";
import { APISuccessSchema } from "./ISuccessResponse";
import { APIErrorSchema } from "./ICustomErrorResponse";



export const GeneratedLinkResponseSchema = APISuccessSchema.extend({
    link: z.string({ message: "Link is required and needs to be a string!" }),
});


export type IGeneratedLinkResponse = z.infer<typeof GeneratedLinkResponseSchema>;


export const ReturnPreexistingLinkSchema = APIErrorSchema.extend({
    link: z.string({ message: "Link is required and needs to be a string!" }),
});

export type IReturnPreexistingLink = z.infer<typeof ReturnPreexistingLinkSchema>;