import { ICustomErrorResponse } from "../../../../shared/models/ICustomErrorResponse";

export const jsonParsingError: ICustomErrorResponse = {
    ok: false,
    status: 0,
    message: "There was an error parsing the json data!!!"
}