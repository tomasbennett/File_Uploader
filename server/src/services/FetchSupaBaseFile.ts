import { ICustomErrorResponse } from "../../../shared/models/ICustomErrorResponse";
import { supabase } from "../supabase/client";

import dotenv from "dotenv";
dotenv.config({
    path: "../../.env"
});

export async function fetchSupaBaseFile(supabaseFileId: string): Promise<Blob | ICustomErrorResponse> {
    const { data, error } = await supabase
        .storage
        .from(process.env.SUPABASE_BUCKET_NAME || "uploads")
        .download(supabaseFileId);

    if (error || !data) {
        return {
            ok: false,
            status: 500,
            message: "Error downloading file from Supabase storage: " + error?.message || "Unknown error"
        }
    }



    return data;



}