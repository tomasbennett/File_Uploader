import styles from "./FolderDialogDisplay.module.css";


type IFolderDialogDisplayProps = {
    placeholder?: string,
    submitBtnText: string

    submitUrl: string
};


export function FolderDialogDisplay({
    placeholder = "Please enter your new folder name here...",
    submitBtnText,

    submitUrl
}: IFolderDialogDisplayProps) {
    return (
        <div className={styles.folderDialogContainer}>

            <form className={styles.form} action={submitUrl} method="post">

                <input 
                    type="text" 
                    name="folderName" 
                    placeholder={placeholder}
                    className={styles.folderNameInput}
                    />

                <button 
                    type="submit" 
                    className={styles.createFolderBtn}
                    >
                    {submitBtnText}
                </button>

            </form>

        </div>
    );
}