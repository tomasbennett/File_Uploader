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
    const dialogRemoveFolderToggle = useDialogToggle();
    const dialogShareFolderToggle = useDialogToggle();

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
                    {/* <div className={styles.optionsContainer}> */}

                        <AddFoldersFilesButtons
                            openFolderDialog={dialogFolderToggle.openDialog}
                            openFileDialog={dialogFileToggle.openDialog}
                            openRemoveFolderDialog={dialogRemoveFolderToggle.openDialog}
                            openShareFolderDialog={dialogShareFolderToggle.openDialog}
                            />

                    {/* </div> */}

                    {/* <div className={styles.foldersContainer}> */}

                        <FolderSidebarDisplay />

                    {/* </div> */}

                </aside>


                <main>


                    <ParentFolderRouteDisplay />

                    <CWDFoldersFilesDisplay />

                    <DialogDisplayLayout 
                        title="Add New Folder"
                        handleClickOutside={dialogFolderToggle.handleClickOutside} 
                        closeDialog={dialogFolderToggle.closeDialog} 
                        dialogRef={dialogFolderToggle.dialogRef}
                        >
                        {/* <FileDialogDisplay /> */}
                        <div>Dialog Content Here</div>
                    </DialogDisplayLayout>

                </main>


            </div>


        </div>
    );
}