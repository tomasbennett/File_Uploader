import { FileIcon } from "../../../assets/icons/FileIcon";
import { FolderIcon } from "../../../assets/icons/FolderIcon";
import styles from "./CWDFoldersFilesDisplay.module.css";


export function CWDFoldersFilesDisplay() {
    return (
        <div className={styles.cwdFoldersFilesContainer}>

            <div className={styles.headerContainer}>

                <h2 className={`${styles.sectionHeader} ${styles.sectionName}`}>Name</h2>

                <p className={`${styles.sectionHeader} ${styles.sectionType}`}>Type</p>

                <p className={`${styles.sectionHeader} ${styles.sectionDate}`}>Created</p>

            </div>


            <div className={styles.itemsContainer}>

                {/* <p className={styles.placeholderText}>No folders or files to display.</p> */}


                <div className={styles.itemRow}>
                    <span className={styles.itemName}>ProjectPlan.docx</span>
                    <span className={styles.itemType}>
                        <FolderIcon />
                    </span>
                    <span className={styles.itemDate}>December 11, 2025</span>
                </div>

                <div className={styles.itemRow}>
                    <span className={styles.itemName}>Whatav</span>
                    <span className={styles.itemType}>
                        <FolderIcon />
                    </span>
                    <span className={styles.itemDate}>December 13, 2025</span>
                </div>

                <div className={styles.itemRow}>
                    <span className={styles.itemName}>AHJDBJDF</span>
                    <span className={styles.itemType}>
                        <FileIcon />
                    </span>
                    <span className={styles.itemDate}>December 1, 2012</span>
                </div>


            </div>
        </div>
    );
}