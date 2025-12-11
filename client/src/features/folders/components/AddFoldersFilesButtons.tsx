import { AddFile } from "../../../assets/icons/AddFile";
import { AddFolder } from "../../../assets/icons/AddFolder";
import { DeleteTrashCan } from "../../../assets/icons/DeleteIcon";
import { ShareArrow } from "../../../assets/icons/ShareArrow";
import styles from "./AddFoldersFilesButtons.module.css";


type IAddFoldersFilesButtonsProps = {
    openFolderDialog: () => void;
    openFileDialog: () => void;
    openRemoveFolderDialog: () => void;
    openShareFolderDialog: () => void;
};

export function AddFoldersFilesButtons({
    openFolderDialog,
    openFileDialog,
    openRemoveFolderDialog,
    openShareFolderDialog
}: IAddFoldersFilesButtonsProps) {





    return (
        <div className={styles.buttonsContainer}>

            <button 
                onClick={(e) => {
                    e.preventDefault();
                    openFolderDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <AddFolder />
                <p>
                    Add Folder
                </p>
            </button>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    openFileDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <AddFile />
                <p>
                    Add File
                </p>
            </button>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    openRemoveFolderDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <DeleteTrashCan />
                <p>
                    Remove Folder
                </p>
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    openShareFolderDialog();
                }} 
                type="button" className={styles.optionBtn}>
                <ShareArrow />
                <p>
                    Share Folder
                </p>
            </button>

        </div>
    );
}