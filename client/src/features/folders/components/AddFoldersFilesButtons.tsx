import { AddFile } from "../../../assets/icons/AddFile";
import { AddFolder } from "../../../assets/icons/AddFolder";
import { DeleteTrashCan } from "../../../assets/icons/DeleteIcon";
import { ShareArrow } from "../../../assets/icons/ShareArrow";
import styles from "./AddFoldersFilesButtons.module.css";


export function AddFoldersFilesButtons() {





    return (
        <div className={styles.buttonsContainer}>

            <button type="button" className={styles.optionBtn}>
                <AddFolder />
                <p>
                    Add Folder
                </p>
            </button>
            <button type="button" className={styles.optionBtn}>
                <AddFile />
                <p>
                    Add File
                </p>
            </button>
            <button type="button" className={styles.optionBtn}>
                <DeleteTrashCan />
                <p>
                    Remove Folder
                </p>
            </button>
            <button type="button" className={styles.optionBtn}>
                <ShareArrow />
                <p>
                    Share Folder
                </p>
            </button>

        </div>
    );
}