'use client';
import { useUserContext } from "@/context/userContext";
import { useParams } from "next/navigation";

function VerifyPage() {
    const params = useParams();
   const verificationToken = params?.verificationToken as string;
    const { verifyUser } = useUserContext();

    return (
        <div className="auth-page flex  justify-center items-center">
            <div className="flex flex-col gap-[1.5rem] bg-white px-13 py-10 rounded-md">
                <h1 className="text-[2rem] text-[#999]">Verify Your Account</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white self-center"
                    onClick={() => verifyUser(verificationToken)}
                >
                    Veriy
                </button>
            </div>
        </div>
    )
}

export default VerifyPage