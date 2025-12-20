import { useEffect, useMemo } from "react";
import { useDialogToggle } from "../hooks/useDialogToggle";
import { FolderPage } from "./FolderPage";
import styles from "./PrivateFolderPage.module.css";
import { IParentFolderPageOutletContext, ParentFolderPage } from "./ParentFolderPage";
import { useOutletContext, useParams } from "react-router-dom";
import { AddFoldersFilesButtons } from "../components/AddFoldersFilesButtons";
import { domain } from "../../../services/EnvironmentAPI";


export function PrivateFolderPage() {

    const { folderId } = useParams<{ folderId: string }>();




    const {
        parentFolders,
        parentFolderId,
        setParentFolders,
        fetchData,

        isLoading,
        setIsLoading,


        folderData,
        setFolderData,

        fileData,

        setIsError,

        abortController
    } = useOutletContext<IParentFolderPageOutletContext>()


    useEffect(() => {
        fetchData(`${domain}/api/folders/${folderId}`);

    }, [folderId]);



    const dialogFolderToggle = useDialogToggle();
    const dialogFileToggle = useDialogToggle();
    const dialogShareFolderToggle = useDialogToggle();




    const currentFolderId = useMemo<string | null>(() => {
        if (parentFolders === null) return null;

        return parentFolders[0].id;

    }, [parentFolders]);

    return (
        <FolderPage asideBtnContainer={
            <AddFoldersFilesButtons
                currentFolderId={currentFolderId}
                parentFolderId={parentFolderId}
                openFolderDialog={dialogFolderToggle.openDialog}
                openFileDialog={dialogFileToggle.openDialog}
                openShareFolderDialog={dialogShareFolderToggle.openDialog}


            />


        }
            parentFolderId={parentFolderId}
            parentFolders={parentFolders}
            setParentFolders={setParentFolders}

            isLoading={isLoading}
            setIsLoading={setIsLoading}
            folderData={folderData}
            setFolderData={setFolderData}
            fileData={fileData}
            setIsError={setIsError}
            abortController={abortController}
        />
    );
}