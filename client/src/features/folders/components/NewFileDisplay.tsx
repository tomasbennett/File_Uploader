import styles from "./NewFileDisplay.module.css";

type INewFileDisplayProps = {

};


export function NewFileDisplay({

}: INewFileDisplayProps) {

    




    return (
        <div className={styles.newFileDialogContainer}>

            <form className={styles.form} method="post">

                <input 
                    type="file" 
                    name="file" 
                    className={styles.fileNameInput}
                    />

                <button 
                    type="submit" 
                    className={styles.createFileBtn}
                    >
                        Upload File
                </button>

            </form>

        </div>
    );
}