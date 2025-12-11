import styles from "./CWDFoldersFilesDisplay.module.css";


export function CWDFoldersFilesDisplay() {
    return (
        <div className={styles.cwdFoldersFilesContainer}>

            <div className={styles.foldersSection}>

                <h2 className={styles.sectionTitle}>Folders</h2>

                <div className={styles.folderItem}>Project A</div>
                <div className={styles.folderItem}>Project B</div>
                <div className={styles.folderItem}>Project C</div>

            </div>

            <div className={styles.filesSection}>

                <h2 className={styles.sectionTitle}>Files</h2>

                <div className={styles.fileItem}>Report.docx</div>
                <div className={styles.fileItem}>Presentation.pptx</div>
                <div className={styles.fileItem}>Budget.xlsx</div>

            </div>

        </div>
    );
}