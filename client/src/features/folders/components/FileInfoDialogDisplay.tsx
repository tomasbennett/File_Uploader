import { IFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import styles from "./FileInfoDialogDisplay.module.css";

type IFileInfoDialogDisplayProps = {
    file: IFileResponse | null,
    downloadUrl: string
};



export function FileInfoDialogDisplay({ file, downloadUrl }: IFileInfoDialogDisplayProps) {
    if (!file) return null;

    const {
        id,
        name: fileName,
        size: fileSize,
        fileType,
        createdAt,
        parentFolderId
    } = file;


    const onDeleteClick = () => {

    };

    const onShareClick = () => {

    };





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

                <button onClick={onDeleteClick} className={`${styles.deleteBtn} ${styles.actionBtn}`} type="button">
                    Delete
                </button>

                <button onClick={onShareClick} className={`${styles.shareBtn} ${styles.actionBtn}`} type="button">
                    Share
                </button>

                <a target="_blank" rel="noopener noreferrer" href={`http://localhost:3000${downloadUrl}/${file.id}`} className={`${styles.downloadBtn} ${styles.actionBtn}`}>
                    Download
                </a>

            </div>

        </div>
    );
}