
'use client';

import React from 'react';
import { UserContextProvider } from '../context/userContext';
interface Pros {
    children: React.ReactNode;
}
function UserProvider({ children }: Pros) {
    return (
        <UserContextProvider>{children}</UserContextProvider>
    )
}

export default UserProvider;
