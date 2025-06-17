'use client';

import { useUserContext } from "@/context/userContext";
import { useState } from "react";

function ForgotPasswordForm() {

    const { forgotPasswordEmail } = useUserContext();
    const [email, setEmail] = useState('');
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    };


    return (
        <form className="m-[52] px-10 py-14 bg-white rounded-lg w-full max-w-[520px]">
            <div className="relative z-10">
                <h1 className="mb-2 text-center text-[2rem] font-bold">
                    Forgot Your Password?
                </h1>

                <div className="flex flex-col mt-[1rem]">
                    <label htmlFor="email" className="mb-1 text-[#999]">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        id="email"
                        className="px-4 py-3 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                        placeholder="ivanivanov@mail.com"
                    />
                </div>

                <div className="flex">
                    <button
                        type="submit"
                        onClick={(e) => forgotPasswordEmail(e, email)}
                        className="mt-[1.5rem] px-4 py-3 flex-1 bg-[#2ecc71] text-white rounded-md hover:bg-[rgb(72,185,119)] transition-colors"
                        disabled={!email}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ForgotPasswordForm