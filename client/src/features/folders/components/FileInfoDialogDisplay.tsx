import { useEffect, useState } from "react";
import { backendUrl } from "../../../../../shared/constants";
import { IFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import styles from "./FileInfoDialogDisplay.module.css";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "../services/ErrorHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { jsonParsingError, notExpectedFormatError } from "../constants";
import { DeleteFileReponseSchema } from "../../../../../shared/models/IDeletedFilesResponse";
import { useDialogToggle } from "../hooks/useDialogToggle";
import { LoadingCircle } from "../../../components/LoadingCircle";

type IFileInfoDialogDisplayProps = {
    file: IFileResponse | null,
    downloadUrl: string,
    setFiles: React.Dispatch<React.SetStateAction<IFileResponse[] | null>>
    closeDialog: ReturnType<typeof useDialogToggle>["closeDialog"];

    asideBtnContainer?: React.ReactNode;
};



export function FileInfoDialogDisplay({ file, downloadUrl, setFiles, closeDialog, asideBtnContainer }: IFileInfoDialogDisplayProps) {
    if (!file) return null;

    const navigate = useNavigate();


    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const [deleteError, setDeleteError] = useState<ICustomErrorResponse | null>(null);
    const [shareError, setShareError] = useState<ICustomErrorResponse | null>(null);



    const {
        id,
        name: fileName,
        size: fileSize,
        fileType,
        createdAt,
        parentFolderId
    } = file;


    const onDeleteClick = async () => {

        try {
            setIsDeleting(true);
            const response = await errorHandler(
                `${domain}/api/files/${id}`,
                "DELETE",
                navigate,
                setDeleteError,
                new AbortController(),
            )

            if (!response) {
                return;
            }

            console.log("WE GOT HERE!!!");
            console.dir(response);

            if (response.status === 204) {

                setFiles(prev => {
                    if (!prev) return prev;
                    return prev.filter(f => f.id !== id)
                });
                closeDialog();

                return;
            }


            const responseData = await response.json();
            const parseResult = APIErrorSchema.safeParse(responseData);
            if (parseResult.success) {
                setDeleteError(parseResult.data);
                return;
            }


            setDeleteError(notExpectedFormatError);
            return;


        } catch (error) {
            console.error("Error deleting file:", error);
            setDeleteError(jsonParsingError);



        } finally {
            setIsDeleting(false);

        }





    };

    const onShareClick = () => {

    };


    useEffect(() => {
        if (deleteError) {
            console.error("Delete File Error:", deleteError);
        }
    }, [deleteError]);


    return (
        <div className={styles.fileInfoDialogContainer}>

            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>File Name:</span>
                <span className={styles.infoValue}>{fileName}</span>
            </div>

            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>File Size:</span>
                <span className={styles.infoValue}>{fileSize}</span>
            </div>

            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>File Type:</span>
                <span className={styles.infoValue}>{fileType}</span>
            </div>

            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Created At:</span>
                <span className={styles.infoValue}>{createdAt.toDateString()}</span>
            </div>

            <div className={styles.btnContainer}>

                {asideBtnContainer &&
                    <>
                        <button onClick={onDeleteClick} className={`${styles.deleteBtn} ${styles.actionBtn}`} type="button">
                            {
                                isDeleting ?
                                    <LoadingCircle width="2.5rem" />
                                    :
                                    "Delete"
                            }

                        </button>

                        <button onClick={onShareClick} className={`${styles.shareBtn} ${styles.actionBtn}`} type="button">
                            {
                                isSharing ?
                                    <LoadingCircle width="2.5rem" />
                                    :
                                    "Share"
                            }
                        </button>

                    </>

                }


                <a target="_blank" rel="noopener noreferrer" href={`${backendUrl}${downloadUrl}/${file.id}`} className={`${styles.downloadBtn} ${styles.actionBtn}`}>
                    Download
                </a>

            </div>

        </div>
    );
}