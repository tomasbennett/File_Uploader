import { useForm } from "react-hook-form";
import styles from "./NewFileDisplay.module.css";
import { INewFileRequest, INewFileRequestBackend, NewFileRequestSchema } from "../../../../../shared/models/INewFileRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { IFileResponse } from "../../../../../shared/models/IFolderFileResponse";
import { jsonParsingError, notExpectedFormatError } from "../constants";
import { basicResponseHandle } from "../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { useDialogToggle } from "../hooks/useDialogToggle";
import { NewFileResponseSchema } from "../../../../../shared/models/INewFileResponse";

type INewFileDisplayProps = {
    currentFolderId: string;
    setFiles: React.Dispatch<React.SetStateAction<IFileResponse[] | null>>;
    closeDialog: ReturnType<typeof useDialogToggle>["closeDialog"];
};


export function NewFileDisplay({
    currentFolderId,
    setFiles,
    closeDialog
}: INewFileDisplayProps) {


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        clearErrors
    } = useForm<INewFileRequest>(
        {
            resolver: zodResolver(NewFileRequestSchema),
            mode: "onSubmit",
            reValidateMode: "onChange",
        }
    )


    const onSubmit = async (data: INewFileRequest) => {
        const file = data.file?.[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("currentFolderId", currentFolderId);
        
        clearErrors();
        try {
            setIsLoading(true);

            const response = await basicResponseHandle<INewFileRequest>(
                `${domain}/api/files/upload`,
                {
                    method: "POST",
                    body: formData,
                    credentials: 'include',

                },
                navigate,
                setIsError,
                setError
            );

            if (response === null) {

                return;
            }

            const responseData = await response.json();
            const parseResult = NewFileResponseSchema.safeParse(responseData);
            if (parseResult.success) {

                const newFile: IFileResponse = parseResult.data.file;

                setFiles((prevFiles) => {
                    if (prevFiles === null) {
                        return [newFile];
                    } else {
                        return [...prevFiles, newFile];
                    }
                });

                reset();
                closeDialog();

                console.log("File uploaded successfully:", newFile);

                return;
            }


            const errorResult = APIErrorSchema.safeParse(responseData);
            if (errorResult.success) {
                console.log("API Error in NewFileDisplay:", errorResult.data);
                console.dir(errorResult.data);

                setIsError(errorResult.data);
                setError("root", { message: errorResult.data.message, type: "server" });
                return;
            }

            setIsError(notExpectedFormatError);
            setError("root", { message: notExpectedFormatError.message, type: "server" });
            return;



        } catch (error) {
            console.error("Error uploading file:", error);
            setIsError(jsonParsingError);
            setError("root", { message: jsonParsingError.message, type: "server" });

        } finally {
            setIsLoading(false);

        }



    }






    // useEffect(() => {
    //     if (isError) {
    //         console.log("Error in NewFileDisplay:");
    //         console.dir(isError);
    //     }
    // }, [isError]);


    return (
        <div className={styles.newFileDialogContainer}>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>




                <input
                    {...register("file")}
                    type="file"
                    name="file"
                    className={styles.fileNameInput}
                />

                {
                    errors.root &&
                    <p className={styles.errorMessage}>
                        {errors.root.message}
                    </p>
                }

                {
                    errors.file &&
                    <p className={styles.errorMessage}>
                        {errors.file.message}
                    </p>
                }



                <button
                    type="submit"
                    className={styles.createFileBtn}
                >
                    {
                        isLoading ?
                            <LoadingCircle width="3.1rem" />

                            :

                            "Upload File"
                    }
                </button>

            </form>

        </div>
    );
}