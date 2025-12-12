import styles from "./ShareFolderDialogDisplay.module.css";


type IShareFolderDialogDisplayProps = {

};


export function ShareFolderDialogDisplay({

}: IShareFolderDialogDisplayProps) {
    return (
        <div className={styles.shareFolderDialogContainer}>



            <form className={styles.form} method="post">

                <label className={styles.option}>
                    <input defaultChecked type="radio" name="duration" value="3600" />
                        1 hour
                </label>

                <label className={styles.option}>
                    <input type="radio" name="duration" value="14400" />
                        4 hours
                </label>

                <label className={styles.option}>
                    <input type="radio" name="duration" value="86400" />
                        1 day
                </label>

                <label className={styles.option}>
                    <input type="radio" name="duration" value="2628000" />
                        1 month
                </label>

                <p className={styles.description}>
                    Please select the duration for which the shareable link will remain active.
                </p>

                <button 
                    type="submit"
                    className={styles.generateLinkBtn}
                    >
                    Generate Link
                </button>

            </form>


        </div>
    );
}