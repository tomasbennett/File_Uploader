import { BackBtnIcon } from "../../../assets/icons/BackBtn";
import styles from "./DialogDisplay.module.css";

type IDialogDisplayLayoutProps = {
    children: React.ReactNode,
    dialogRef: React.RefObject<HTMLDialogElement | null>,

    closeDialog: () => void,
    handleClickOutside: (event: React.MouseEvent<HTMLDialogElement, MouseEvent>) => void

    title: string
};

export function DialogDisplayLayout({
    children,
    dialogRef,
    closeDialog,
    handleClickOutside,

    title
}: IDialogDisplayLayoutProps) {
    return (
        <dialog
            className={styles.dialogElement}
            ref={dialogRef}
            onClick={(event) => handleClickOutside(event)}
            >

            <div className={styles.dialogContainer}>

                <div className={styles.headerContainer}>

                    <h2 className={styles.dialogTitle}>{title}</h2>
                    <div
                        className={styles.backBtnContainer}
                        onClick={() => { closeDialog(); }}
                        >

                        <BackBtnIcon />

                    </div>

                </div>

                {
                    children
                }

            </div>

        </dialog>
    );
}