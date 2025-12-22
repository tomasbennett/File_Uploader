import { useState } from "react";
import { CopyClipboard } from "../../../assets/icons/CopyClipboard";
import styles from "./GeneratedLinkBox.module.css";
import { CheckMark } from "../../../assets/icons/CheckMark";
import { LoadingCircle } from "../../../components/LoadingCircle";


type IGeneratedLinkBoxProps = {
    link: string;
    header: string;
};


export function GeneratedLinkBox({ link, header }: IGeneratedLinkBoxProps) {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    
    


    const onCopyToClipboard = async () => {
        const timer: number = 4000;

        try {
            await navigator.clipboard.writeText(link);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), timer); 
        } catch (err) {
            setError(true);
            setTimeout(() => setError(false), timer);
        }
    }


    
    
    return (
        <>

            <div className={styles.generatedLinkContainer}>
                <div className={styles.headerContainer}>

                    <p className={styles.label}>{header}</p>


                    {
                        isError ?
                            <p>Error Copying</p>
                        :
                        isLoading ?
                            <div className={styles.copySVGContainer}>
                                <LoadingCircle width="1.5rem" />
                            </div>  
                        :
                        copySuccess ?
                            <div className={styles.copySVGContainer}>
                                <CheckMark />
                            </div>
                        :

                        <div onClick={onCopyToClipboard} className={`${styles.copyToClipBoard} ${styles.copySVGContainer}`}>
                            <CopyClipboard />
                        </div>  
                    }




                </div>
                <div className={styles.bodyContainer}>

                    <p className={styles.genLink}>
                        {link}
                    </p>

                </div>



            </div>
        
        </>
    )
}