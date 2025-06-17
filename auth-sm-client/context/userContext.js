import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthHandlers } from '@/hooks/userHooks';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [userState, setUserState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const {
    registerHandler,
    loginHandler,
    logoutHandler,
    userLoginStatus,
    getUser,
    updateUser,
    emailVerification,
    verifyUser,
    forgotPasswordEmail,
    resetPassword,
    handlerUserInputs,
    changePassword,
    getAllUsers,
    deleteUser,
    users
  } = useAuthHandlers({
    userState,
    setUserState,
    setUser,
    setLoading,
  });

  useEffect(() => {
    const initialize = async () => {
      const isLoggedIn = await userLoginStatus();
      if (isLoggedIn) {
        await getUser();
      }
    };
    initialize();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userState,
        user,
        loading,
        users,
        handlerUserInputs,
        registerHandler,
        loginHandler,
        logoutHandler,
        userLoginStatus,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        getAllUsers,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};