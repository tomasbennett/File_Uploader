import React, { useRef } from "react";

// setDialogContentState: React.Dispatch<React.SetStateAction<IDialogContentStates | null>>


export function useDialogToggle() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = () => {
        dialogRef.current?.showModal();
        dialogRef.current?.setAttribute("data-animation-opening", "true");
    };

    const closeDialog = () => {
        dialogRef.current?.setAttribute("data-animation-opening", "false");
        dialogRef.current?.addEventListener("animationend", () => {
            
            dialogRef.current?.close();
            // setDialogContentState(null);
        }, { once: true });
        
    };

    const handleClickOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (!dialogRef.current) return;

        const rect = dialogRef.current.getBoundingClientRect();
        const { clientX: x, clientY: y } = event;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            closeDialog();
        }
    }


    return {
        dialogRef,

        openDialog,
        closeDialog,
        handleClickOutside
    }
}