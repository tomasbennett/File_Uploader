import { environment } from "../../../shared/constants";

export const domain: string = environment === "PROD" ? "" : "http://localhost:3000";
export const frontendDomain: string = environment === "PROD" ? "" : "http://localhost:5173";