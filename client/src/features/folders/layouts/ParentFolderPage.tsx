import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { IFileResponse, IFolderFileResponse, IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { useFetchFoldersPage } from "../hooks/useFetchFoldersPage";
import { jsonParsingError } from "../constants";
import { errorHandler } from "../services/ErrorHandler";
import { domain } from "../../../services/EnvironmentAPI";

import styles from "./ParentFolderPage.module.css";
import { LogoutIcon } from "../../../assets/icons/LogoutIcon";


export type IParentFolderPageOutletContext = {
    parentFolders: IFolderResponse[] | null;
    setParentFolders: React.Dispatch<React.SetStateAction<IFolderResponse[] | null>>;
    parentFolderId: string | null;

    fetchData: (url: string) => Promise<void>;

    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

    folderData: IFolderResponse[] | null;
    setFolderData: React.Dispatch<React.SetStateAction<IFolderResponse[] | null>>;

    fileData: IFileResponse[] | null;
    setFileData: React.Dispatch<React.SetStateAction<IFileResponse[] | null>>;

    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>;

    abortController: React.MutableRefObject<AbortController | null>;

}


export function ParentFolderPage() {



    // const { folderId } = useParams<{ folderId: string }>();


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    const [folderData, setFolderData] = useState<IFolderResponse[] | null>(null);
    const [fileData, setFileData] = useState<IFileResponse[] | null>(null);
    // const [parentFolders, setParentFolders] = useState<IFolderResponse[] | null>(null);


    const abortController = useRef<AbortController | null>(null);


    const {
        getFullPageData
    } = useFetchFoldersPage(
        {
            setIsLoading,
            setIsError
        }
    );




    async function fetchData(url: string) {
        abortController.current?.abort();

        abortController.current = new AbortController();

        console.log("process started!!!");

        const folderFilesResponse: IFolderFileResponse | null = await getFullPageData(
            url,
            abortController.current
        );

        if (folderFilesResponse === null) {
            console.log("returned null!!!");
            return;

        }

        console.dir(folderFilesResponse);

        setFolderData(folderFilesResponse.cwdFolders);
        setFileData(folderFilesResponse.cwdFiles);
        setParentFolders(folderFilesResponse.parentFolders);

        return;

    }



    const [parentFolders, setParentFolders] = useState<IFolderResponse[] | null>(null);

    const parentFolderId = useMemo<string | null>(() => {
        if (parentFolders === null) {
            return null;
        }

        if (parentFolders.length <= 1) {
            return null;
        }

        return parentFolders[1].id;

    }, [parentFolders]);





    const navigate = useNavigate();

    const onLogOut = useCallback(async () => {
        const url: string = `${domain}/sign-in/logout`;

        setIsLoading(true);

        try {
            abortController.current?.abort();

            const response: Response | null = await errorHandler(
                url,
                "POST",
                navigate,
                setIsError,
                new AbortController()
            )

            if (response === null) {
                return;

            }

            if (response.status === 200) {
                navigate("/sign-in/login", { replace: true });
                return;

            }

            try {
                const jsonData = await response.json();

                const errorResult = APIErrorSchema.safeParse(jsonData);
                if (errorResult.success) {
                    setIsError(errorResult.data);
                    return;

                }

                const notExpectedFormatError: ICustomErrorResponse = {
                    ok: false,
                    status: 0,
                    message: "The returned data from logout was not in the correct format!!!"
                }
                setIsError(notExpectedFormatError);
                return;

            } catch {
                setIsError(jsonParsingError);
                return null;

            }



        } finally {
            setIsLoading(false);

        }


    }, []);












    const context: IParentFolderPageOutletContext = {
        parentFolders,
        setParentFolders,
        parentFolderId,

        fetchData,

        isLoading,
        setIsLoading,
        folderData,
        setFolderData,
        fileData,
        setFileData,
        setIsError,
        abortController
    }

    return (
        <div className={styles.folderPageContainer}>
            <header className={styles.headerContainer}>

                <h1>Folders & Files</h1>

                <div
                    className={styles.logOutContainer}
                    onClick={onLogOut}
                >

                    <LogoutIcon />

                </div>

            </header>

            <Outlet context={context} />
        </div>



    );
}