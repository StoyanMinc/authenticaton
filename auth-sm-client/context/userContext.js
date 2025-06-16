import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const UserContext = createContext();
//TODO REFACTORING NEEDED!
export const UserContextProvider = ({ children }) => {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const [user, setUser] = useState({});
    const [userState, setUserState] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const registerHandler = async (e) => {
        e.preventDefault();
        if (!userState.username || !userState.email || !userState.password) {
            toast.error('All fields are required!');
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userState.email)) {
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
        } catch (error) {
            console.log('Error register user:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        if (!userState.email || !userState.password) {
            toast.error('All fields are required!');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userState.email)) {
            toast.error('Please enter a valid email address.');
            return
        }
        setLoading(true);

        try {
            await axios.post(`${BASE_URL}/api/user/login`, {
                email: userState.email,
                password: userState.password
            }, {
                withCredentials: true // send cookies
            });
            setUserState({
                email: '',
                password: ''
            });
            router.push('/');
            toast.success('Login successfully!');
        } catch (error) {
            console.log('Error login user:', error);
            toast.error(error.response.data.message);
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
            router.push('/login')
        } catch (error) {
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
    }

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/user/get-user`, {
                withCredentials: true
            });
            console.log(response)
            setUser((prev) => ({ ...prev, ...response.data }));
        } catch (error) {
            console.log('Error getting user:', error);
            toast.error(error.data.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (e, data) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`${BASE_URL}/api/user/update-user`, data, {
                withCredentials: true
            });
            setUser((prev) => ({ ...prev, ...response.data }));
            toast.success('User updated successfully!');
        } catch (error) {
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
        } catch (error) {
            console.log('Error sending verification email:', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    const verifyUser = async (token) => {
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/user/verify-user/${token}`, {
                withCredentials: true
            });
            toast.success('Verify user successfully!');
            getUser();
            router.push('/');
        } catch (error) {
            console.log('Error verify user:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    const handlerUserInputs = (name) => (e) => {
        const value = e.target.value;
        setUserState((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    useEffect(() => {
        const getLoginStatus = async () => {
            const isLoggin = await userLoginStatus();
            if (isLoggin) {
                getUser();
            }
        }
        getLoginStatus();
    }, [])

    return (
        <UserContext.Provider value={{
            userState,
            user,
            handlerUserInputs,
            registerHandler,
            loginHandler,
            logoutHandler,
            userLoginStatus,
            updateUser,
            emailVerification,
            verifyUser,
        }}>
            {children}
        </UserContext.Provider>
    )
};

export const useUserContext = () => {
    return useContext(UserContext);
}