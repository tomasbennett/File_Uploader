import { Outlet, useMatches } from "react-router-dom";
import styles from "./SignInLayout.module.css";
import { useEffect, useState } from "react";
import { ISignInContext } from "../models/ISignInContext";
import { maxUsernamePasswordLength as maxUsernameLength, minUsernamePasswordLength } from "../../../shared/constants";


export function SignInLayout() {
    const matches = useMatches() as Array<{ handle?: ISignInContext }>;

    const title = matches.find(match => match.handle?.title)?.handle?.title || "Sign In";
    const submitUrl = title.toLowerCase();  



    return (
        <>
            <Outlet />

            <div className={styles.signinOuterContainer}>
                <h2>{title}</h2>

                <form action={`/sign-in/${submitUrl}`} method="POST">
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
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
                        <label htmlFor="password">Password</label>
                        <input
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


                    {
                        submitUrl === "login" ?

                        <p className={styles.switchSignInParagraph}>
                            Don't have an account?
                            <a href={`/sign-in/register`}>Sign up here</a>
                        </p>

                        :

                        <p className={styles.switchSignInParagraph}>
                            Already have an account?
                            <a href={`/sign-in/login`}>Log in here</a>
                        </p>
                    }

                </form>
            </div>
        </>
    )
}