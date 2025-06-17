'use client';

import { useUserContext } from "@/context/userContext";
import { useState } from "react";

export default function LoginForm() {
    
    const { loginHandler, userState, handlerUserInputs } = useUserContext();
    const { email, password } = userState;
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="m-[52] px-10 py-14 bg-white rounded-lg w-full max-w-[520px] shadow-lg">
            <div className="relative z-10">
                <h1 className="mb-2 text-center text-[2rem] font-bold">
                    Login
                </h1>
                <p className="mb-8 px-[2rem] text-center text-[14px] text-[#999]">
                    You don't have an account? {' '}
                    <a href="/register" className="text-[#2ecc71] font-bold hover:text-[rgb(72,185,119)] transition-all duration-300">
                        Register here
                    </a>
                </p>
                <div className="flex flex-col mt-[1rem]">
                    <label htmlFor="email" className="mb-1 text-[#999]">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => handlerUserInputs('email')(e)}
                        id="email"
                        className="px-4 py-3 text-gray-800 border-[2px] border-[#999] outline-[#2ecc71] rounded-md"
                        placeholder="ivanivanov@mail.com"
                    />
                </div>
                <div className="relative flex flex-col mt-[1rem]">
                    <label htmlFor="password" className="mb-1 text-[#999]">Password</label>
                    <input
                        type={showPassword ? "text" : 'password'}
                        name="password"
                        value={password}
                        onChange={(e) => handlerUserInputs('password')(e)}
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
                <div className="mt-4 flex justify-end">
                    <a href="/forgot-password"
                        className="font-bold text-[#2ecc71] text-[14px] hover:text-[rgb(72,185,119)]"
                    >
                        Forgot password?
                    </a>
                </div>
                <div className="flex">
                    <button
                        type="submit"
                        onClick={loginHandler}
                        className="mt-[1.5rem] px-4 py-3 flex-1 bg-[#2ecc71] text-white rounded-md hover:bg-[rgb(72,185,119)] transition-colors"
                    // disabled={!email || !name || !password}
                    >
                        Login Now
                    </button>
                </div>
            </div>
        </form>
    )
}