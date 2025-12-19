import z from "zod";
import { APISuccessSchema } from "./ISuccessResponse";



export const GeneratedLinkResponseSchema = APISuccessSchema.extend({
    link: z.string({ message: "Link is required and needs to be a string!" }),
});


export type IGeneratedLinkResponse = z.infer<typeof GeneratedLinkResponseSchema>;