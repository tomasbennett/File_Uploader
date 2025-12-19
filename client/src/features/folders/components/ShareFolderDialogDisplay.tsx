import { useForm } from "react-hook-form";
import styles from "./ShareFolderDialogDisplay.module.css";
import { IShareDuration, ShareDurationSchema } from "../../../../../shared/models/ISharedFolderTimeResponse";
import { zodResolver } from "@hookform/resolvers/zod";


type IShareFolderDialogDisplayProps = {

};


export function ShareFolderDialogDisplay({

}: IShareFolderDialogDisplayProps) {


    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        resolver: zodResolver(ShareDurationSchema),
        defaultValues: {
            duration: 3600
        }
    });


    const onSubmit = async (data: IShareDuration) => {
        console.log("Selected duration (in seconds):", data.duration);
    }



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

                <button 
                    type="submit"
                    className={styles.generateLinkBtn}
                    >
                    Generate Link
                </button>

            </form>


        </div>
    );
}