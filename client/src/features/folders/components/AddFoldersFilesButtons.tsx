import { useEffect, useRef, useState } from "react";
import { AddFile } from "../../../assets/icons/AddFile";
import { AddFolder } from "../../../assets/icons/AddFolder";
import { DeleteTrashCan } from "../../../assets/icons/DeleteIcon";
import { ShareArrow } from "../../../assets/icons/ShareArrow";
import styles from "./AddFoldersFilesButtons.module.css";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { errorHandler } from "../services/ErrorHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { jsonParsingError, notExpectedFormatError } from "../constants";
import { DialogDisplayLayout } from "../layouts/DialogDisplay";
import { useDialogToggle } from "../hooks/useDialogToggle";


type IAddFoldersFilesButtonsProps = {
    openFolderDialog: () => void;
    openFileDialog: () => void;
    openShareFolderDialog: () => void;

    currentFolderId: string | null,
    parentFolderId: string | null
};

export function AddFoldersFilesButtons({
    openFolderDialog,
    openFileDialog,
    openShareFolderDialog,

    currentFolderId,
    parentFolderId
}: IAddFoldersFilesButtonsProps) {
    const navigate = useNavigate();

    const deleteErrorDialog = useDialogToggle();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);
    
    
    const abortController = useRef<AbortController | null>(null)
    
    const onDelete = async () => {
        try {
            if (currentFolderId === null || parentFolderId === null) {
                setIsError({
                    ok: false,
                    status: 0,
                    message: "Can not delete root folder!!!"
                });

                deleteErrorDialog.openDialog();


                return;
            }

            setIsLoading(true);

            abortController.current?.abort();

            abortController.current = new AbortController()

            const response: Response | null = await errorHandler(
                `${domain}/api/folders/${currentFolderId}`,
                "DELETE",
                navigate,
                setIsError,
                abortController.current
            );

            if (response === null) {
                deleteErrorDialog.openDialog();
                return;
            }

            if (response.status === 204 && response.ok) {
                navigate(`/folder/${parentFolderId}`, { replace: true });
                return;
            }

            const jsonData = await response.json();

            deleteErrorDialog.openDialog();

            const errorResult = APIErrorSchema.safeParse(jsonData);
            if (errorResult.success) {

                setIsError(errorResult.data);
                return;

            }

            setIsError(notExpectedFormatError);


        } catch (error) {
            setIsError(jsonParsingError);
            deleteErrorDialog.openDialog();


            
        } finally {
            setIsLoading(false);

        }


    }


    useEffect(() => {
        console.log(isError);
    }, [isError]);



    return (
        <div className={styles.buttonsContainer}>

            <button 
                onClick={(e) => {
                    e.preventDefault();
                    openFolderDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <AddFolder />
                <p>
                    Add Folder
                </p>
            </button>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    openFileDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <AddFile />
                <p>
                    Add File
                </p>
            </button>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                        onDelete();

                    }


                }} 
                type="button" className={styles.optionBtn}>
                <DeleteTrashCan />
                <p>
                    Remove Folder
                </p>
                {
                    isLoading &&
                        <LoadingCircle width="1.7rem" />
                }

            </button>
            <DialogDisplayLayout
                dialogRef={deleteErrorDialog.dialogRef}
                closeDialog={deleteErrorDialog.closeDialog}
                handleClickOutside={deleteErrorDialog.handleClickOutside}
                title="Error Deleting Folder"
            >
                {
                    isError && 
                        <p className={styles.errorMessage}>
                            {isError.message}
                        </p>

                }

            </DialogDisplayLayout>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    openShareFolderDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <ShareArrow />
                <p>
                    Share Folder
                </p>
            </button>

        </div>
    );
}