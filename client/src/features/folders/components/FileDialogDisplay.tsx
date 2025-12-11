import styles from './FileDialogDisplay.module.css';

type IFileDialogDisplayProps = {
    placeholder: string;
    
};



export function FileDialogDisplay({

}: IFileDialogDisplayProps) {
    return (
        <div className={styles.fileDialogContainer}>

        </div>
    );
}