'use client';
import { useUserContext } from "@/context/userContext";
import useRedirectUser from "@/hooks/useUserRedirect";
import { useEffect, useState } from "react";
import ChangePassword from "./components/auth/changePasswordForm/ChangePasswordForm";

export default function Home() {
    useRedirectUser('/login')
    const { logoutHandler, user, handlerUserInputs, updateUser, userState, emailVerification, getAllUsers, users, deleteUser } = useUserContext();
    const { username, photo, isVerified, bio } = user

    const [showTextArea, setShowTextArea] = useState(false);

    useEffect(() => {
        if (user && (user.role === 'creator' || user.role === 'admin')) {
            getAllUsers()
        }
    }, [user?.role])
    console.log(users);

    return (
        <main className="py-[2rem] mx-[8rem]">
            <header className="flex justify-between">
                <h1 className="text-[2rem]">
                    Welcome <span className="text-red-600">{username}</span>
                </h1>
                <div className="flex items-center gap-4">
                    <img className="w-[40px] h-[40px] rounded-full" src={photo} alt={username} />
                    {!isVerified && (
                        <button
                            onClick={emailVerification}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            Verify Account
                        </button>
                    )}
                    <button
                        onClick={logoutHandler}
                        className="px-4 py-2 bg-red-600 rounded-md text-white  hover:bg-red-700 transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <div className="flex flex-col">

                <section className="flex-1">
                    <p className="text-[#999] text-[2rem]">{bio}</p>
                    <button
                        className="mt-[0.5rem] px-4 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[rgb(72,185,119)] transition-all duration-300"
                        onClick={() => setShowTextArea(!showTextArea)}
                    >
                        Update Bio
                    </button>
                    {showTextArea && (
                        <form className="mt-4 max-w-[400px] w-full">
                            <div className="flex flex-col">
                                <label htmlFor="bio" className="mb-1 text-[#999]">bio</label>
                                <textarea
                                    className="px-4 py-3 border-[2px] rounded-md outline-[#2ecc71] text-gray-800"
                                    name="bio"
                                    id="bio"
                                    defaultValue={bio}
                                    onChange={(e) => handlerUserInputs('bio')(e)}
                                ></textarea>
                            </div>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md mt-[10px] hover:bg-blue-600 transition-all duration-300"
                                onClick={(e) => updateUser(e, { bio: userState.bio }, setShowTextArea(false))}
                            >
                                send
                            </button>
                        </form>
                    )}
                </section>
                <div className="flex gap-8 mt-10">
                    <div className="flex-1">
                        <ChangePassword />
                    </div>
                    <div className="flex-1">
                        {user.role === 'admin' && (
                            <ul>
                                {users.filter((u: any) => u._id !== user._id).map((user: any) => (
                                <li
                                    key={user._id}
                                    className="grid grid-cols-4 items-center gap-4 border mb-2 p-1"
                                >
                                    <img
                                        src={user.photo} alt={user.username}
                                        className="w-[40px] h-[40px] rounded-full"
                                    />
                                    <p>{user.username}</p>
                                    <p className="text-[12px]">{user.bio}</p>
                                    <button
                                        className="bg-red-500 rounded-md px-1 py-1 text-white hover:bg-red-600 transition-colors"
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}
