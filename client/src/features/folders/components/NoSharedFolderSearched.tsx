import styles from "./NoSharedFolderSearched.module.css";



export function NoSharedFolderSearched() {
    return (
        <div className={styles.container}>
            <h2 className={styles.header}>No Shared Folder Searched</h2>
            <p className={styles.desc}>Please search for a shared ID in the URL to access a public folder.</p>
        </div>
    );
}