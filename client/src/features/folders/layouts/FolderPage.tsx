import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./FolderPage.module.css";
import { useParams } from "react-router-dom";
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
import { ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { useFetchFoldersPage } from "../hooks/useFetchFoldersPage";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { domain } from "../../../services/EnvironmentAPI";

export function FolderPage() {

    const { folderId } = useParams<{ folderId: string }>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    const [folderData, setFolderData] = useState<IFolderResponse[] | null>(null);
    const [fileData, setFileData] = useState<IFileResponse[] | null>(null);
    const [parentFolders, setParentFolders] = useState<IFolderResponse[] | null>(null);


    const {
        getFullPageData
    } = useFetchFoldersPage(
        {
            setIsLoading,
            setIsError
        }
    );


    useEffect(() => {

        async function fetchData() {
            const folderFilesResponse: IFolderFileResponse | null = await getFullPageData(folderId);

            if (folderFilesResponse === null) {
                return;

            }

            setFolderData(folderFilesResponse.cwdFolders);
            setFileData(folderFilesResponse.cwdFiles);
            setParentFolders(folderFilesResponse.parentFolders);

            return;

        }

        fetchData();


    }, [folderId]);



    const dialogFolderToggle = useDialogToggle();
    const dialogFileToggle = useDialogToggle();
    const dialogShareFolderToggle = useDialogToggle();

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


    const parentFolderId = useMemo<string | undefined>(() => {
        if (parentFolders === null) {
            return undefined;
        }

        return parentFolders[1]?.id;

    }, [parentFolders])



    const onLogOut = useCallback(async () => {
        const url: string = `${domain}/sign-in/logout`;

        try {
            const logoutConfirmationData = await fetch(url, {
                method: 'POST',

            });



            
        } catch (error) {
            

        }
    }, []);



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



            {
                isLoading ?
                    <div className={styles.loadingContainer}>

                        <LoadingCircle width="6rem" />

                    </div>

                    :

                    <div className={styles.mainContainer}>

                        <aside>

                            <DialogDisplayLayout
                                title="Add New Folder"
                                handleClickOutside={dialogFolderToggle.handleClickOutside}
                                closeDialog={dialogFolderToggle.closeDialog}
                                dialogRef={dialogFolderToggle.dialogRef}
                            >
                                <FolderDialogDisplay
                                    submitBtnText="Create Folder"
                                    submitUrl="/folders/create-folder"
                                    placeholder="Please enter your new folder name here..."
                                />

                            </DialogDisplayLayout>


                            <DialogDisplayLayout
                                title="Add New File"
                                handleClickOutside={dialogFileToggle.handleClickOutside}
                                closeDialog={dialogFileToggle.closeDialog}
                                dialogRef={dialogFileToggle.dialogRef}
                            >
                                <NewFileDisplay />

                            </DialogDisplayLayout>


                            <DialogDisplayLayout
                                title="Share this folder"
                                handleClickOutside={dialogShareFolderToggle.handleClickOutside}
                                closeDialog={dialogShareFolderToggle.closeDialog}
                                dialogRef={dialogShareFolderToggle.dialogRef}
                            >

                                <ShareFolderDialogDisplay />

                            </DialogDisplayLayout>











                            <AddFoldersFilesButtons
                                openFolderDialog={dialogFolderToggle.openDialog}
                                openFileDialog={dialogFileToggle.openDialog}
                                openShareFolderDialog={dialogShareFolderToggle.openDialog}
                            />


                            <FolderSidebarDisplay
                                parentFolderId={parentFolderId}
                                isRoot={isRoot}
                                folders={folderData} />

                        </aside>


                        <main>


                            <ParentFolderRouteDisplay />

                            <CWDFoldersFilesDisplay
                                openFileInfoDialog={dialogFileInfoToggle.openDialog}
                                setFileInfoData={setFileInfoData} />

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

        </div>
    );
}