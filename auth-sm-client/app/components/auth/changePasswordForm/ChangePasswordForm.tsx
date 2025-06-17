'use client';
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import toast from "react-hot-toast";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const { changePassword } = useUserContext();

    const handleCurrentPasswordChange = (e: any) => {
        setCurrentPassword(e.target.value)
    };
    const handleNewPasswordChange = (e: any) => {
        setNewPassword(e.target.value)
    };
    const handleConfirmNewPasswordChange = (e: any) => {
        setConfirmNewPassword(e.target.value)
    };

    const changePasswordHandler = (e: any) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('Password don\'t match!');
            return
        }
        changePassword(currentPassword, newPassword);
    }
    return (
        <form className="px-8 py-10 bg-white rounded-lg w-full max-w-[420px] shadow-lg">
            <div className="relative z-10">
                <h1 className="mb-2 text-center text-[1.2rem] font-bold">
                    Change Password
                </h1>

                <div className="relative flex flex-col mt-[1rem]">
                    <label htmlFor="password" className="mb-1 text-[#999]">Current password</label>
                    <input
                        type={showCurrentPassword ? "text" : 'password'}
                        name="password"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                        id="password"
                        className="px-3 py-2 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                        placeholder="**********"
                    />

                    <button
                        type="button"
                        className="absolute p1 right-4 top-[50%] text-[18px] text-[#999] opacity-45"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        <i className={showCurrentPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                    </button>
                </div>
                <div className="relative flex flex-col mt-[1rem]">
                    <label htmlFor="confirmPassword" className="mb-1 text-[#999]">New password</label>
                    <input
                        type={showNewPassword ? "text" : 'password'}
                        name="confirmPassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        id="confirmPassword"
                        className="px-3 py-2 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                        placeholder="**********"
                    />

                    <button
                        type="button"
                        className="absolute p1 right-4 top-[50%] text-[18px] text-[#999] opacity-45"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        <i className={showNewPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                    </button>
                </div>
                  <div className="relative flex flex-col mt-[1rem]">
                    <label htmlFor="confirmNewPassword" className="mb-1 text-[#999]">Confirm new password</label>
                    <input
                        type={showConfirmNewPassword ? "text" : 'password'}
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={handleConfirmNewPasswordChange}
                        id="confirmNewPassword"
                        className="px-3 py-2 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                        placeholder="**********"
                    />

                    <button
                        type="button"
                        className="absolute p1 right-4 top-[50%] text-[18px] text-[#999] opacity-45"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                        <i className={showNewPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                    </button>
                </div>

                <div className="flex">
                    <button
                        // type="button"
                        onClick={changePasswordHandler}
                        className="mt-[1.5rem] px-3 py-2 flex-1 bg-[#2ecc71] text-white rounded-md hover:bg-[rgb(72,185,119)] transition-colors"
                        disabled={!currentPassword || !newPassword || !confirmNewPassword}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ChangePassword