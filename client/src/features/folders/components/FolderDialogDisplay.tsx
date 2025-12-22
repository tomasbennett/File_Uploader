import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./FolderDialogDisplay.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { INewFolderForm, INewFolderSubmittable, NewFolderFormSchema, NewFolderSchema } from "../../../../../shared/models/INewFolderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorHandler } from "../services/ErrorHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { jsonParsingError, notExpectedFormatError } from "../constants";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { FolderResponseSchema, IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import { basicResponseHandle } from "../services/BasicResponseHandle";


type IFolderDialogDisplayProps = {
    placeholder?: string,
    submitBtnText: string

    submitUrl: string,

    closeDialog: (postCloseAction?: () => void) => void,

    // setIsFoldersLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFoldersData: React.Dispatch<React.SetStateAction<IFolderResponse[] | null>>,
    parentId: string | null
};


export function FolderDialogDisplay({
    placeholder = "Please enter your new folder name here...",
    submitBtnText,

    closeDialog,

    setFoldersData,
    // setIsFoldersLoading,

    submitUrl,
    parentId
}: IFolderDialogDisplayProps) {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);


    const {
        register,
        formState: { errors },
        setError,
        clearErrors,
        handleSubmit,
        reset

    } = useForm<INewFolderForm>({
        resolver: zodResolver(NewFolderFormSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
    });




    // const abortController = useRef<AbortController | null>(null);

    const onSubmit: SubmitHandler<INewFolderForm> = async (data) => {
        const url: string = `${domain}/api/folders`
        
        clearErrors();
        setIsLoading(true);


        try {
            // abortController.current?.abort();
            // abortController.current = new AbortController();


            const submitData: INewFolderSubmittable = {
                ...data,
                parentId: parentId
            }

            console.dir(submitData)

            // const response: Response | null = await errorHandler(
            //     url,
            //     "POST",
            //     navigate,
            //     setIsError,
            //     abortController.current,
            //     submitData
            // );

            const response = await basicResponseHandle<INewFolderSubmittable>(
                url,
                {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitData)
                },
                navigate,
                setIsError,
                setError
            );

            if (response === null) {
                return;
            }


            const jsonData = await response.json();

            const foldersDataResult = FolderResponseSchema.safeParse(jsonData);
            if (foldersDataResult.success && response.status === 201) {
                
                setFoldersData(prev => {
                    if (prev !== null) 
                        return [...prev, foldersDataResult.data]

                    return [foldersDataResult.data]
                });


                closeDialog();
                reset();



                return;

            }


            const errorResponseResult = APIErrorSchema.safeParse(jsonData);
            if (errorResponseResult.success) {
                setIsError(errorResponseResult.data);
                return;


            }


            setIsError(notExpectedFormatError);
            return;


        } catch (error) {
            setIsError(jsonParsingError);
            return;

        } finally {
            setIsLoading(false);

        }

    }

    useEffect(() => {
        console.log(isError);
    }, [isError]);

    return (
        <div className={styles.folderDialogContainer}>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                <div className={styles.inputContainer}>

                    <input
                        {...register("folderName")}
                        type="text"
                        name="folderName"
                        id="folderName"
                        placeholder={placeholder}
                        className={styles.folderNameInput}
                    />

                    {
                        errors.folderName &&
                            <p className={styles.errorMessage}>{errors.folderName.message}</p>
                    }

{
                        errors.root &&
                            <p className={styles.errorMessage}>{errors.root.message}</p>
                    }
                    
                </div>



                <button
                    type="submit"
                    className={styles.createFolderBtn}
                >
                    {
                        isLoading ?
                            <LoadingCircle width="3.1rem" />
                        
                        :
                        
                            submitBtnText
                    }
                </button>

            </form>

        </div>
    );
}