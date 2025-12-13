import { IFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import styles from "./FileInfoDialogDisplay.module.css";

type IFileInfoDialogDisplayProps = {
    file: IFileResponse | null
};



export function FileInfoDialogDisplay({ file }: IFileInfoDialogDisplayProps) {
    if (!file) return null;

    const {
        id,
        name: fileName,
        size: fileSize,
        fileType,
        createdAt,
        parentFolderId
    } = file;


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

                <button className={`${styles.deleteBtn} ${styles.actionBtn}`} type="button">
                    Delete
                </button>

                <button className={`${styles.shareBtn} ${styles.actionBtn}`} type="button">
                    Share
                </button>

                <button className={`${styles.downloadBtn} ${styles.actionBtn}`} type="button">
                    Download
                </button>

            </div>

        </div>
    );
}