import { useEffect, useState } from "react";
import styles from "./FolderPage.module.css";
import { useParams } from "react-router-dom";
import { LogoutIcon } from "../../../assets/icons/LogoutIcon";
import { AddFoldersFilesButtons } from "../components/AddFoldersFilesButtons";
import { FolderSidebarDisplay } from "../components/FolderSidebarDisplay";
import { ParentFolderRouteDisplay } from "../components/ParentFolderRouteDisplay";
import { CWDFoldersFilesDisplay } from "../components/CWDFoldersFilesDisplay";

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

                        <AddFoldersFilesButtons />

                    {/* </div> */}

                    {/* <div className={styles.foldersContainer}> */}

                        <FolderSidebarDisplay />

                    {/* </div> */}

                </aside>


                <main>


                    <ParentFolderRouteDisplay />

                    <CWDFoldersFilesDisplay />


                </main>


            </div>


        </div>
    );
}