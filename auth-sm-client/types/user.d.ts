export interface UserState {
    username: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    username: string;
    photo: string;
    bio: string;
    role: string;
    isVerified: boolean | string;
    createdAt: string;
    updatedAt: string;
    __v: number | string;
}

export interface UserContextType {
    userState: UserState;
    user: User;
    loading: boolean;
    handlerUserInputs: (name: keyof UserState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    registerHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loginHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    logoutHandler: () => Promise<void>;
    userLoginStatus: () => Promise<boolean>;
    updateUser: (e: React.FormEvent<HTMLFormElement>, data: Partial<User>) => Promise<void>;
    emailVerification: () => Promise<void>;
    verifyUser: (token: string) => Promise<void>;
    forgotPasswordEmail: (e: React.FormEvent<HTMLFormElement>, email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
}
