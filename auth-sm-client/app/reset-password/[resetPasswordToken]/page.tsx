'use client';

import { useUserContext } from "@/context/userContext";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function ResetPassword() {
    const params = useParams();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetPasswordToken = params?.resetPasswordToken as string;
    const { resetPassword } = useUserContext();

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value)
    };
    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value)
    };

    const resetPasswordHandler = (e: any) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password don\'t match!');
            return
        }
        resetPassword(resetPasswordToken, password)
    }
    return (
        <div className="auth-page flex  justify-center items-center">
            <form className="m-[52] px-10 py-14 bg-white rounded-lg w-full max-w-[520px]">
                <div className="relative z-10">
                    <h1 className="mb-2 text-center text-[2rem] font-bold">
                        Reset Password
                    </h1>

                    <div className="relative flex flex-col mt-[1rem]">
                        <label htmlFor="password" className="mb-1 text-[#999]">Password</label>
                        <input
                            type={showPassword ? "text" : 'password'}
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            id="password"
                            className="px-4 py-3 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                            placeholder="**********"
                        />

                        <button
                            type="button"
                            className="absolute p1 right-4 top-[47%] text-[22px] text-[#999] opacity-45"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                        </button>
                    </div>
                    <div className="relative flex flex-col mt-[1rem]">
                        <label htmlFor="confirmPassword" className="mb-1 text-[#999]">Password</label>
                        <input
                            type={showConfirmPassword ? "text" : 'password'}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            id="confirmPassword"
                            className="px-4 py-3 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                            placeholder="**********"
                        />

                        <button
                            type="button"
                            className="absolute p1 right-4 top-[47%] text-[22px] text-[#999] opacity-45"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <i className={showConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                        </button>
                    </div>

                    <div className="flex">
                        <button
                            // type="button"
                            onClick={(e) => resetPasswordHandler(e)}
                            className="mt-[1.5rem] px-4 py-3 flex-1 bg-[#2ecc71] text-white rounded-md hover:bg-[rgb(72,185,119)] transition-colors"
                            disabled={!password}
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default ResetPassword