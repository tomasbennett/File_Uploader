import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { LoadingCircle } from "../components/LoadingCircle";

export function ProtectedRoute() {
    const [auth, setAuth] = useState<boolean | null>(null);

    useEffect(() => {
        console.log("SignInLayout mounted");
    
        async function checkAuth() {
            try {
                console.log("Checking auth...");
                const response = await fetch('http://localhost:3000/auth/check', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { Accept: 'application/json' }
                });
                console.log("Fetch response received");
    
                if (response.ok) {
                    setAuth(true);
                } else {
                    const data = await response.json();
                    console.log(data?.message);
                    console.log("not authenticated");
                    setAuth(false);
                }
            } catch (error) {
                console.log("Fetch error:", error);
                setAuth(false);
            }
        }
    
        checkAuth();
    }, []);
    


    if (auth === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: '1 1 0' }}>
                <LoadingCircle width="5rem" />
            </div>
        )

    } else if (auth === false) {
        window.location.href = '/sign-in/login';
        return null;

    } else {
        return <Outlet />;

    }

}