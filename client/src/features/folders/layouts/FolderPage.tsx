import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./FolderPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { LogoutIcon } from "../../../assets/icons/LogoutIcon";
import { AddFoldersFilesButtons } from "../components/AddFoldersFilesButtons";
import { FolderSidebarDisplay } from "../components/FolderSidebarDisplay";
import { ParentFolderRouteDisplay } from "../components/ParentFolderRouteDisplay";
import { CWDFoldersFilesDisplay } from "../components/CWDFoldersFilesDisplay";
import { DialogDisplayLayout } from "./DialogDisplay";
import { useDialogToggle } from "../hooks/useDialogToggle";
import { FolderDialogDisplay } from "../components/FolderDialogDisplay";
import { NewFileDisplay } from "../components/NewFileDisplay";
import { ShareFolderDialogDisplay } from "../components/ShareFolderDialogDisplay";
import { IFileResponse, IFolderFileResponse, IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import { FileInfoDialogDisplay } from "../components/FileInfoDialogDisplay";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { useFetchFoldersPage } from "../hooks/useFetchFoldersPage";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { domain } from "../../../services/EnvironmentAPI";
import { errorHandler } from "../services/ErrorHandler";
import { jsonParsingError } from "../constants";


type IFolderPageProps = {
    asideBtnContainer?: React.ReactNode;
    dialogFolderToggle?: ReturnType<typeof useDialogToggle>;
    dialogShareFolderToggle?: ReturnType<typeof useDialogToggle>;
    dialogFileToggle?: ReturnType<typeof useDialogToggle>;

    currentFolderId?: string | null;

    parentFolders: IFolderResponse[] | null;
    setParentFolders: React.Dispatch<React.SetStateAction<IFolderResponse[] | null>>;

    parentFolderId: string | null;


    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    folderData: IFolderResponse[] | null;
    setFolderData: React.Dispatch<React.SetStateAction<IFolderResponse[] | null>>;
    fileData: IFileResponse[] | null;

    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>;

    abortController: React.MutableRefObject<AbortController | null>;
}


export function FolderPage({
    asideBtnContainer,
    dialogFolderToggle,
    dialogShareFolderToggle,
    dialogFileToggle,

    currentFolderId,

    parentFolders,
    setParentFolders,
    parentFolderId,

    isLoading,
    setIsLoading,
    folderData,
    setFolderData,
    fileData,

    setIsError,

    abortController
}: IFolderPageProps) {

    // const { folderId } = useParams<{ folderId: string }>();


    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    // const [folderData, setFolderData] = useState<IFolderResponse[] | null>(null);
    // const [fileData, setFileData] = useState<IFileResponse[] | null>(null);
    // // const [parentFolders, setParentFolders] = useState<IFolderResponse[] | null>(null);


    // const abortController = useRef<AbortController | null>(null);


    // const {
    //     getFullPageData
    // } = useFetchFoldersPage(
    //     {
    //         setIsLoading,
    //         setIsError
    //     }
    // );


    // useEffect(() => {

    //     async function fetchData() {
    //         abortController.current?.abort();

    //         abortController.current = new AbortController();

    //         console.log("process started!!!");

    //         const folderFilesResponse: IFolderFileResponse | null = await getFullPageData(
    //             folderId,
    //             abortController.current
    //         );

    //         if (folderFilesResponse === null) {
    //             console.log("returned null!!!");
    //             return;

    //         }

    //         console.dir(folderFilesResponse);

    //         setFolderData(folderFilesResponse.cwdFolders);
    //         setFileData(folderFilesResponse.cwdFiles);
    //         setParentFolders(folderFilesResponse.parentFolders);

    //         return;

    //     }

    //     fetchData();


    // }, [folderId]);



    // const dialogFolderToggle = useDialogToggle();
    // const dialogFileToggle = useDialogToggle();
    // const dialogShareFolderToggle = useDialogToggle();

    const dialogFileInfoToggle = useDialogToggle();
    const [fileInfoData, setFileInfoData] = useState<IFileResponse | null>(null);





    const isRoot = useMemo<boolean>(() => {
        if (!parentFolders) {
            return false;
        }

        if (parentFolders.length > 1) {
            return false;
        }

        return true;

    }, [parentFolders]);


    // const parentFolderId = useMemo<string | null>(() => {
    //     if (parentFolders === null) {
    //         return null;
    //     }

    //     if (parentFolders.length <= 1) {
    //         return null;
    //     }

    //     return parentFolders[1].id;

    // }, [parentFolders]);


    // const currentFolderId = useMemo<string | null>(() => {
    //     if (parentFolders === null) return null;

    //     return parentFolders[0].id;

    // }, [parentFolders]);


    // const navigate = useNavigate();

    // const onLogOut = useCallback(async () => {
    //     const url: string = `${domain}/sign-in/logout`;

    //     setIsLoading(true);

    //     try {
    //         abortController.current?.abort();

    //         const response: Response | null = await errorHandler(
    //             url,
    //             "POST",
    //             navigate,
    //             setIsError,
    //             new AbortController()
    //         )

    //         if (response === null) {
    //             return;

    //         }

    //         if (response.status === 200) {
    //             navigate("/sign-in/login", { replace: true });
    //             return;

    //         }

    //         try {
    //             const jsonData = await response.json();

    //             const errorResult = APIErrorSchema.safeParse(jsonData);
    //             if (errorResult.success) {
    //                 setIsError(errorResult.data);
    //                 return;

    //             }

    //             const notExpectedFormatError: ICustomErrorResponse = {
    //                 ok: false,
    //                 status: 0,
    //                 message: "The returned data from logout was not in the correct format!!!"
    //             }
    //             setIsError(notExpectedFormatError);
    //             return;

    //         } catch {
    //             setIsError(jsonParsingError);
    //             return null;

    //         }


            
    //     } finally {
    //         setIsLoading(false);

    //     }


    // }, []);

    // useEffect(() => {
    //     console.log(isError);
    // }, [isError])


    return (
        // <div className={styles.folderPageContainer}>
        <>

            {/* <header className={styles.headerContainer}>

                <h1>Folders & Files</h1>

                <div 
                    className={styles.logOutContainer}
                    onClick={onLogOut}
                    >

                    <LogoutIcon />

                </div>

            </header> */}



            {
                isLoading ?
                    <div className={styles.loadingContainer}>

                        <LoadingCircle width="6rem" />

                    </div>

                    :

                    <div className={styles.mainContainer}>

                        <aside>

                            {
                                dialogFolderToggle && currentFolderId &&

                                    <DialogDisplayLayout
                                        title="Add New Folder"
                                        handleClickOutside={dialogFolderToggle?.handleClickOutside}
                                        closeDialog={dialogFolderToggle?.closeDialog}
                                        dialogRef={dialogFolderToggle?.dialogRef}
                                    >
                                        <FolderDialogDisplay
                                            parentId={currentFolderId}
                                            setFoldersData={setFolderData}
                                            closeDialog={dialogFolderToggle?.closeDialog}
                                            submitBtnText="Create Folder"
                                            submitUrl="/folders/create-folder"
                                            placeholder="Please enter your new folder name here..."
                                        />

                                    </DialogDisplayLayout>
                            }

                            {
                                dialogFileToggle &&

                                    <DialogDisplayLayout
                                        title="Add New File"
                                        handleClickOutside={dialogFileToggle?.handleClickOutside}
                                        closeDialog={dialogFileToggle?.closeDialog}
                                        dialogRef={dialogFileToggle?.dialogRef}
                                    >
                                        <NewFileDisplay />

                                    </DialogDisplayLayout>
                            }

                            {
                                dialogShareFolderToggle && currentFolderId &&

                                    <DialogDisplayLayout
                                        title="Share this folder"
                                        handleClickOutside={dialogShareFolderToggle?.handleClickOutside}
                                        closeDialog={dialogShareFolderToggle?.closeDialog}
                                        dialogRef={dialogShareFolderToggle?.dialogRef}
                                    >

                                        <ShareFolderDialogDisplay folderId={currentFolderId} />

                                    </DialogDisplayLayout>
                            }













                            {asideBtnContainer}
                            {/* <AddFoldersFilesButtons
                                currentFolderId={currentFolderId}
                                parentFolderId={parentFolderId}
                                openFolderDialog={dialogFolderToggle.openDialog}
                                openFileDialog={dialogFileToggle.openDialog}
                                openShareFolderDialog={dialogShareFolderToggle.openDialog}
                            /> */}


                            <FolderSidebarDisplay
                                parentFolderId={parentFolderId}
                                isRoot={isRoot}
                                folders={folderData} />

                        </aside>


                        <main>


                            <ParentFolderRouteDisplay
                                parentFolders={parentFolders}
                            />

                            <CWDFoldersFilesDisplay
                                openFileInfoDialog={dialogFileInfoToggle.openDialog}
                                setFileInfoData={setFileInfoData}
                                cwdFiles={fileData}
                                cwdFolders={folderData}
                                />

                            <DialogDisplayLayout
                                title="File Information"
                                handleClickOutside={dialogFileInfoToggle.handleClickOutside}
                                closeDialog={dialogFileInfoToggle.closeDialog}
                                dialogRef={dialogFileInfoToggle.dialogRef}
                                postCloseAction={() => setFileInfoData(null)}
                            >
                                <FileInfoDialogDisplay file={fileInfoData} />

                            </DialogDisplayLayout>

                        </main>


                    </div>
            }

        </>
    );
}