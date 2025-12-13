import { useEffect, useState } from "react";
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
import { IFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import { FileInfoDialogDisplay } from "../components/FileInfoDialogDisplay";

export function FolderPage() {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<Error | null>(null);


    const { folderId } = useParams<{ folderId: string }>();


    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setIsError(null);

                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log(`Fetching data for folderId: ${folderId}`);

            } catch (error) {
                setIsError(error as Error);

            } finally {
                setIsLoading(false);

            }
        };

        fetchData();


    }, [folderId]);




    const dialogFolderToggle = useDialogToggle();
    const dialogFileToggle = useDialogToggle();
    const dialogShareFolderToggle = useDialogToggle();
    
    const dialogFileInfoToggle = useDialogToggle();


    const [fileInfoData, setFileInfoData] = useState<IFileResponse | null>(null);


    return (
        <div className={styles.folderPageContainer}>

            <header className={styles.headerContainer}>

                <h1>Folders & Files</h1>

                <div className={styles.logOutContainer}>

                    <LogoutIcon />

                </div>

            </header>

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
                    <FolderSidebarDisplay />

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


        </div>
    );
}