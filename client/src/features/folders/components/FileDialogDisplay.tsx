import styles from './FileDialogDisplay.module.css';

export function FileDialogDisplay() {
    return (
        <dialog className={styles.dialogElement}>

            <div className={styles.fileDialogContainer}>
                <div className={styles.dialogHeader}>
                    <h2>This file here!!!</h2>
                </div>
                <div className={styles.dialogBody}>
                    <p className={styles.placeholderText}>File dialog content goes here.</p>
                </div>
                <div className={styles.dialogFooter}>
                    <button type="button" className={styles.cancelButton}>Cancel</button>
                    <button type="button" className={styles.selectButton}>Select</button>
                </div>
            </div>

        </dialog>
    );
}