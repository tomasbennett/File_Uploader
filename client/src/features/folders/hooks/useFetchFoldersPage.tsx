import React, { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { IFolderResponse, IFileResponse, FolderFileResponseSchema } from "../../../../../shared/models/IFolderFileResponse";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";


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


    const getFullPageData = async (folderId: string | undefined) => {
        if (!folderId) {
            console.error("No folderId provided to fetch data.");
            return;
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

                }
            
                navigate('/error', {
                    replace: true,
                    state: {
                        error: serverError
                    }
                });
            
                return null;
            }

            if (response.status === 401 || response.status === 403) {
                
                
                navigate('/sign-in/login', { 
                    replace: true
                });
                return null;
            }




            const jsonData = await response.json();
            const result = FolderFileResponseSchema.safeParse(jsonData);



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