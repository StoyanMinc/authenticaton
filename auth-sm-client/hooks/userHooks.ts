import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { User, UserState } from '@/types/user';
import { useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const useAuthHandlers = ({
    userState,
    setUserState,
    setUser,
    setLoading,

}: {
    userState: UserState;
    setUserState: React.Dispatch<React.SetStateAction<UserState>>;
    setUser: React.Dispatch<React.SetStateAction<User> | {}>;
    setLoading: (val: boolean) => void;

}) => {
    const router = useRouter();
    const [users, setUsers] = useState<User[] | []>([]);

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, email, password } = userState;

        if (!username || !email || !password) {
            toast.error('All fields are required!');
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return
        }
        setLoading(true);

        try {
            await axios.post(`${BASE_URL}/api/user/register`, userState);
            setUserState({
                username: '',
                email: '',
                password: ''
            });
            router.push('/login');
            toast.success('Register successfully!');
        } catch (error: any) {
            console.log('Error register user:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = userState;
        if (!email || !password) {
            toast.error('All fields are required!');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return
        }
        setLoading(true);

        try {
            await axios.post(`${BASE_URL}/api/user/login`, {
                email: email,
                password: password
            }, {
                withCredentials: true
            });
            setUserState({
                email: '',
                password: '',
                username: ''
            });
            toast.success('Login successfully!');
            getUser();
            router.push('/');

        } catch (error: any) {
            console.log('Error login user:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/user/get-user`, {
                withCredentials: true
            });
            setUser((prev) => ({ ...prev, ...response.data }));
        } catch (error: any) {
            console.log('Error getting user:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const logoutHandler = async () => {
        try {
            await axios.get(`${BASE_URL}/api/user/logout`, {
                withCredentials: true
            });
            toast.success('Logout successfully!');
            setUser({})
            setUsers([]);
            router.push('/login');
        } catch (error: any) {
            console.log('Error logout user:', error);
            toast.error(error.data.message);
        }
    };

    const userLoginStatus = async () => {
        let isLoggin = false
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/user/check-login`, {
                withCredentials: true
            });
            isLoggin = !!response.data;
        } catch (error) {
            console.log('Error checking user login:', error);
        } finally {
            setLoading(false);
        }
        return isLoggin;
    };

    const updateUser = async (e: React.FormEvent<HTMLFormElement>, data: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`${BASE_URL}/api/user/update-user`, data, {
                withCredentials: true
            });
            setUser((prev) => ({ ...prev, ...response.data }));
            toast.success('User updated successfully!');
        } catch (error: any) {
            console.log('Error updating user:', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    const emailVerification = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${BASE_URL}/api/user/verify-email`, {}, {
                withCredentials: true
            });

            toast.success('Verification email is sended!');
        } catch (error: any) {
            console.log('Error sending verification email:', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    const verifyUser = async (token: string) => {
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/user/verify-user/${token}`, {
                withCredentials: true
            });
            toast.success('Verify user successfully!');
            getUser();
            router.push('/');
        } catch (error: any) {
            console.log('Error verify user:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    };

    const forgotPasswordEmail = async (e: React.FormEvent<HTMLFormElement>, email: keyof UserState) => {
        e.preventDefault();
        setLoading(true)
        try {
            await axios.post(`${BASE_URL}/api/user/forgot-password`, { email });
            toast.success('Successfully sending reset password email!');

        } catch (error: any) {
            console.log('Error sending forgot password email:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    };

    const resetPassword = async (token: String, password: keyof UserState) => {
        setLoading(true);

        try {
            await axios.post(`${BASE_URL}/api/user/reset-password/${token}`, { password });
            toast.success('Reset password successfully!');
            router.push('/login');
        } catch (error: any) {
            console.log('Error reseting password:', error);
            toast.error(error.message);
        }
    }

    const handlerUserInputs = (name: keyof UserState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserState((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/api/user/change-password`,
                { currentPassword, newPassword }, {
                withCredentials: true
            });
            setLoading(false);
            toast.success('Successfully change password!');
        } catch (error: any) {
            console.log('Error change password:', error);
            toast.error(error.response.data.message)
        }
    };

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/get-users`, {
                withCredentials: true
            });
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string) => {
        setLoading(true);

        try {
            await axios.delete(`${BASE_URL}/api/admin/delete-user/${userId}`, {
                withCredentials: true
            });
            setUsers((prev) => prev.filter((user) => user._id !== userId));
            toast.success('Successfully delete user!');
        } catch (error: any) {
            console.log('Error delete user:', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    return {
        users,
        registerHandler,
        loginHandler,
        getUser,
        logoutHandler,
        userLoginStatus,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        handlerUserInputs,
        changePassword,
        getAllUsers,
        deleteUser
    }
}