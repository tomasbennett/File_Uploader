import { Link, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import styles from "./SignInLayout.module.css";
import { ISignInContext } from "../models/ISignInContext";
import { ILoginForm, ISignInError, IUsernamePassword, SignInErrorSchema, loginFormSchema, maxUsernamePasswordLength as maxUsernameLength, minUsernamePasswordLength, usernamePasswordSchema } from "../../../shared/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { domain } from "../services/EnvironmentAPI";
import { useEffect, useRef } from "react";


export function SignInLayout() {
    const matches = useMatches() as Array<{ handle?: ISignInContext }>;

    const title = matches.find(match => match.handle?.title)?.handle?.title || "Sign In";
    const submitUrl = title.toLowerCase();


    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<ILoginForm>({
        resolver: zodResolver(loginFormSchema),
        mode: "onSubmit",
        reValidateMode: "onChange"
    });


    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        try {
            const response = await fetch(`${domain}/sign-in/${submitUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // window.location.href = "/";
                navigate("/", { replace: true });
                return;

            } else {
                const responseData = await response.json();
                const errorResult = SignInErrorSchema.safeParse(responseData);

                if (errorResult.success) {
                    setError(errorResult.data.inputType, { type: "server", message: errorResult.data.message });

                } else {
                    setError("root", { type: "server", message: "An unknown error occurred." }); //PLEASE DON'T FORGET FOR LATER PROJECTS THAT root CAN HAVE ADDITIONAL PROPERTIES ATTACHED TO IT FOR CUSTOM ERRORS IF YOU HAVE A SERVER ERROR UNRELATED TO THE USER INPUTS LIKE root.serverError

                }

            }

        } catch (error) {
            setError("root", { type: "server", message: "Failed to connect to the server." });

        }
    }


    const location = useLocation();
    const stateERRORS = location.state?.errors as ISignInError | undefined;


    const errorResult = SignInErrorSchema.safeParse(stateERRORS);
    const appliedRef = useRef<boolean>(false);

    if (errorResult.success && !appliedRef.current) {
        appliedRef.current = true;
        setError(errorResult.data.inputType, { type: "server", message: errorResult.data.message });

    }





    useEffect(() => {
        clearErrors();

        if (stateERRORS) {
            window.history.replaceState({}, document.title);

        }

    }, [location.pathname]);


    // const stateERRORS = location.state?.errors as ISignInError | undefined;
    // useEffect(() => {
    //     if (stateERRORS) {
    //         const errorResult = SignInErrorSchema.safeParse(stateERRORS);

    //         if (errorResult.success) {
    //             setError(errorResult.data.inputType, { type: "server", message: errorResult.data.message });

    //         }
    //     }

    // }, [errors, setError]);

    return (
        <>
            <Outlet />

            <div className={styles.signinOuterContainer}>
                <h2>{title}</h2>

                {/* <form action={`/sign-in/${submitUrl}`} method="POST"> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {
                        errors.root && (
                            <p className={styles.errorMessage}>{errors.root.message}</p>
                        )
                    }
                    <div className={styles.inputGroup}>
                        {
                            errors.username && (
                                <p className={styles.errorMessage}>{errors.username.message}</p>
                            )
                        }
                        <label htmlFor="username">Username</label>
                        <input
                            {...register("username")}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username..."
                            required
                            minLength={minUsernamePasswordLength}
                            maxLength={maxUsernameLength}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        {
                            errors.password && (
                                <p className={styles.errorMessage}>{errors.password.message}</p>
                            )
                        }
                        <label htmlFor="password">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password..."
                            required
                            minLength={minUsernamePasswordLength}
                            maxLength={maxUsernameLength}
                        />
                    </div>

                    <button className={styles.submitButton} type="submit">Submit</button>

                </form>
                {
                    submitUrl === "login" ?

                        <p className={styles.switchSignInParagraph}>
                            Don't have an account?
                            <Link to="/sign-in/register">Sign up here</Link>
                        </p>
                        :
                        <p className={styles.switchSignInParagraph}>
                            Already have an account?
                            <Link to="/sign-in/login">Log in here</Link>
                        </p>

                }
            </div>
        </>
    )
}