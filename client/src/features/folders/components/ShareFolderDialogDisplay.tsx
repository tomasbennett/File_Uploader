import { useForm } from "react-hook-form";
import styles from "./ShareFolderDialogDisplay.module.css";
import { IShareDuration, ISharedFolderTimeResponse, ShareDurationSchema } from "../../../../../shared/models/ISharedFolderTimeResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorHandler } from "../services/ErrorHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/models/ICustomErrorResponse";
import { jsonParsingError, notExpectedFormatError } from "../constants";
import { GeneratedLinkResponseSchema } from "../../../../../shared/models/IGeneratedLinkResponse";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { basicResponseHandle } from "../services/BasicResponseHandle";


type IShareFolderDialogDisplayProps = {
    folderId: string | null;
};


export function ShareFolderDialogDisplay({
    folderId
}: IShareFolderDialogDisplayProps) {


    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        clearErrors
    } = useForm({
        resolver: zodResolver(ShareDurationSchema)
    });


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<ICustomErrorResponse | null>(null);

    const navigation = useNavigate();

    const onSubmit = async (data: IShareDuration) => {
        console.log("Selected duration (in seconds):", data.duration);

        setIsLoading(true);
        clearErrors();

        if (folderId === null) {
            setError("duration", { message: "Folder ID is null. Cannot generate link.", type: "manual" });
            return;
        }


        const durationObj: ISharedFolderTimeResponse = {
            duration: data.duration,
            folderId: folderId
        }

        try {
            const response = await basicResponseHandle<IShareDuration>(
                `${domain}/api/public`,
                {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(durationObj)
                },
                navigation,
                setApiError,
                setError
            );


            // const response: Response | null = await errorHandler(
            //     `${domain}/api/public`,
            //     "POST",
            //     navigation,
            //     setApiError,
            //     new AbortController(),
            //     durationObj
            // )

            if (response === null) {
                return;
            }


            const responseData = await response.json();

            const apiResponseResult = GeneratedLinkResponseSchema.safeParse(responseData);
            if (apiResponseResult.success) {
                console.log("Generated Link Response:", apiResponseResult.data);
                console.dir(apiResponseResult.data);
                reset();

                return;
            }

            const apiErrorResult = APIErrorSchema.safeParse(responseData);
            if (apiErrorResult.success) {
                setApiError(apiErrorResult.data);
                setError("root", { message: apiErrorResult.data.message, type: "server" });
                return;
            }

            setApiError(notExpectedFormatError);
            setError("root", { message: notExpectedFormatError.message, type: "server" });
            return;


        } catch (error) {
            console.error("Error parsing response JSON:", error);
            setApiError(jsonParsingError);
            setError("root", { message: jsonParsingError.message, type: "server" });
            return;

        } finally {
            setIsLoading(false);

        }





    }

    useEffect(() => {
        console.log("API Error:", apiError);
    }, [apiError]);


    return (
        <div className={styles.shareFolderDialogContainer}>



            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                <label className={styles.option}>
                    <input defaultChecked={true} {...register("duration")} type="radio" name="duration" value="3600" />
                    1 hour
                </label>

                <label className={styles.option}>
                    <input {...register("duration")} type="radio" name="duration" value="14400" />
                    4 hours
                </label>

                <label className={styles.option}>
                    <input {...register("duration")} type="radio" name="duration" value="86400" />
                    1 day
                </label>

                <label className={styles.option}>
                    <input {...register("duration")} type="radio" name="duration" value="2628000" />
                    1 month
                </label>

                <p className={styles.description}>
                    Please select the duration for which the shareable link will remain active.
                </p>

                {
                    errors.duration &&
                    <p className={styles.errorMessage}>
                        {errors.duration.message}
                    </p>
                }

                {
                    errors.root &&
                    <p className={styles.errorMessage}>
                        {errors.root.message}
                    </p>
                }

                <button
                    type="submit"
                    className={styles.generateLinkBtn}
                >
                    {
                        isLoading ?
                            <LoadingCircle width="3.1rem" />
                            :

                            "Generate Link"
                    }
                </button>

            </form>


        </div>
    );
}