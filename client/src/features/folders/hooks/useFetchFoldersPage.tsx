import React, { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { IFolderResponse, IFileResponse, FolderFileResponseSchema, IFolderFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { ISignInError } from "../../../../../shared/constants";


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

    const jsonParsingError: ICustomErrorResponse = {
        ok: false,
        status: 0,
        message: "There was an error parsing the json data!!!"
    }


    const getFullPageData: (folderId: string | undefined) => Promise<IFolderFileResponse | null> = async (folderId: string | undefined) => {
        if (!folderId) {
            console.error("No folderId provided to fetch data!!!");
            return null;

        }



        setIsLoading(true);
        setIsError(null);

        try {

            const response = await fetch(`${domain}/api/folders/${folderId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });


            if (response.status >= 500 && response.status <= 599) {

                const serverError: ICustomErrorResponse = {
                    ok: false,
                    status: response.status,
                    message: response?.statusText || "Internal Server Error"
                };
            
                try {
                    const data = await response.json();

                    const result = APIErrorSchema.safeParse(data);
                    if (result.success) {
                        serverError.message = result.data.message;
                        
                    }

                } catch (err) {
                    console.error("Error parsing server error response:", err);
                    setIsError(jsonParsingError);
                    return null;

                }
            
                navigate('/error', {
                    replace: true,
                    state: {
                        error: serverError
                    }
                });
            
                return null;
            }

            if (response.status === 401) {
                
                const signInError: ISignInError = {
                    message: "You were logged out!!!",
                    inputType: "root"
                }
                navigate('/sign-in/login', { 
                    replace: true,
                    state: {
                        error: signInError
                    }
                });

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




        } catch (error: unknown) {
            console.error("Error fetching folder page data:", error);

            if (!(error instanceof Error)) {
                navigate('/error', {
                    replace: true,
                    state: {
                        error: {
                            ok: false,
                            status: 0,
                            message: "An unknown error occurred."
                        }
                    }
                });

                return null;
            }

            if (error.name === "AbortError") {
                console.log("Fetch aborted in catch block!!!");
                return null; // ??? Why return null here or error?

            }

            const customError: ICustomErrorResponse = {
                ok: false,
                status: 0,
                message: error.message
            };
            setIsError(customError);
            return null;

        } finally {
            setIsLoading(false);

        }
    }

    return {
        getFullPageData
    }


}