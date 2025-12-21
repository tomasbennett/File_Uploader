import { useOutlet, useOutletContext, useParams } from "react-router-dom";
import { FolderPage } from "./FolderPage";
import styles from "./PublicFolderPage.module.css";
import { IParentFolderPageOutletContext } from "./ParentFolderPage";
import { useEffect } from "react";
import { domain } from "../../../services/EnvironmentAPI";



export function PublicFolderPage() {
    const { sharedId } = useParams<{ sharedId: string }>();


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
        setFileData,

        setIsError,

        abortController
    } = useOutletContext<IParentFolderPageOutletContext>();


    useEffect(() => {
        fetchData(`${domain}/api/public/${sharedId}`);

    }, [sharedId]);



    return (
        <FolderPage
            openInNewTabUrl="/api/public/inline-file"
            downloadUrl="/download/public"
            setFileData={setFileData}
            foldersUrl="/folder/public/"
            parentFolders={parentFolders}
            parentFolderId={parentFolderId}
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