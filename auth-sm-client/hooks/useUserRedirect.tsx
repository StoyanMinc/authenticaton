'use client'
import { useUserContext } from "@/context/userContext"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const useRedirectUser = (redirect: string) => {
    const { userLoginStatus } = useUserContext();
    const router = useRouter();

    useEffect(() => {
        const redirectUser = async () => {
            try {
                const isLoggedUser = await userLoginStatus();
                if (!isLoggedUser) {
                    router.push(redirect);
                }
            } catch (error) {
                console.log('Error redirecting user:', error);
            }
        };
        redirectUser();
    }, [redirect, router, userLoginStatus])
};

export default useRedirectUser;