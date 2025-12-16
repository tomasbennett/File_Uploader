import React, { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { IFolderResponse, IFileResponse, FolderFileResponseSchema, IFolderFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { ISignInError } from "../../../../../shared/constants";
import { jsonParsingError } from "../constants";
import { errorHandler } from "../services/ErrorHandler";


type IUseFetchFoldersPageProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>;
}


export function useFetchFoldersPage({
    setIsLoading,
    setIsError
}: IUseFetchFoldersPageProps) {

    const navigate = useNavigate();

    const [isSuccess, setIsSuccess] = useState<boolean>(false);


    const getFullPageData: (
        folderId: string | undefined,
        abortController: AbortController
    ) => Promise<IFolderFileResponse | null> = async (folderId: string | undefined, abortController: AbortController) => {
        if (!folderId) {
            console.error("No folderId provided to fetch data!!!");
            return null;

        }



        setIsLoading(true);
        setIsError(null);

        try {

            // const response = await fetch(`${domain}/api/folders/${folderId}`, {
            //     method: 'GET',
            //     credentials: 'include',
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // });


            // if (response.status >= 500 && response.status <= 599) {

            //     const serverError: ICustomErrorResponse = {
            //         ok: false,
            //         status: response.status,
            //         message: response?.statusText || "Internal Server Error"
            //     };
            
            //     try {
            //         const data = await response.json();

            //         const result = APIErrorSchema.safeParse(data);
            //         if (result.success) {
            //             serverError.message = result.data.message;
                        
            //         }

            //     } catch (err) {
            //         console.error("Error parsing server error response:", err);
            //         setIsError(jsonParsingError);
            //         return null;

            //     }
            
            //     navigate('/error', {
            //         replace: true,
            //         state: {
            //             error: serverError
            //         }
            //     });
            
            //     return null;
            // }

            // if (response.status === 401) {
                
            //     const signInError: ISignInError = {
            //         message: "You were logged out!!!",
            //         inputType: "root"
            //     }
            //     navigate('/sign-in/login', { 
            //         replace: true,
            //         state: {
            //             error: signInError
            //         }
            //     });

            //     return null;

            // }

            const response: Response | null = await errorHandler(
                `${domain}/api/folders/${folderId}`,
                "GET",
                navigate,
                setIsError,
                abortController
            );

            if (response === null) {
                return null;

            }


            try {
                const jsonData = await response.json();

                const result = FolderFileResponseSchema.safeParse(jsonData);
                if (result.success) {
                    return result.data;

                }

                const errorResult = APIErrorSchema.safeParse(jsonData);
                if (errorResult.success) {
                    console.log("success error!!!");
                    setIsError(errorResult.data);
                    return null;

                }

                const notExpectedFormatError: ICustomErrorResponse = {
                    ok: false,
                    status: 0,
                    message: "The returned data was not in the correct format!!!"
                }
                setIsError(notExpectedFormatError);
                return null;

            } catch {
                setIsError(jsonParsingError);
                return null;

            }




        } finally {
            setIsLoading(false);

        }
    }

    return {
        getFullPageData
    }


}