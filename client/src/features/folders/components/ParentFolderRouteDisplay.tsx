import styles from "./ParentFolderRouteDisplay.module.css";


export function ParentFolderRouteDisplay() {

    return (
        <div className={styles.parentFolderRouteContainer}>

            <span className={styles.separator}>:</span>
            <span className={styles.folderRouteItem}>root</span>
            <span className={styles.separator}>&gt;</span>
            <span className={styles.folderRouteItem}>Projects</span>
            <span className={styles.separator}>&gt;</span>
            <span className={styles.folderRouteItem}>2024</span>
            <span className={styles.separator}>&gt;</span>

            <span className={`${styles.folderRouteItem} ${styles.currentFolderRouteItem}`}>June</span>

        </div>
    );
}