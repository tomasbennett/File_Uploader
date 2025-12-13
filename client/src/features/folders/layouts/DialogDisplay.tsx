import { BackBtnIcon } from "../../../assets/icons/BackBtn";
import styles from "./DialogDisplay.module.css";

type IDialogDisplayLayoutProps = {
    children: React.ReactNode,
    dialogRef: React.RefObject<HTMLDialogElement | null>,

    closeDialog: (postCloseAction?: () => void) => void,
    handleClickOutside: (event: React.MouseEvent<HTMLDialogElement, MouseEvent>, postCloseAction?: () => void) => void
    postCloseAction?: () => void,

    title: string
};

export function DialogDisplayLayout({
    children,
    dialogRef,
    closeDialog,
    handleClickOutside,

    postCloseAction,

    title
}: IDialogDisplayLayoutProps) {
    return (
        <dialog
            className={styles.dialogElement}
            ref={dialogRef}
            onClick={(event) => handleClickOutside(event, postCloseAction)}
            >

            <div className={styles.dialogContainer}>

                <div className={styles.headerContainer}>

                    <h2 className={styles.dialogTitle}>{title}</h2>
                    <div
                        className={styles.backBtnContainer}
                        onClick={() => { closeDialog(postCloseAction); }}
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