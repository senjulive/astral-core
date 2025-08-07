
'use client';

import * as React from 'react';

// This context is now simplified as we no longer need to pass the password around.
// The primary use is to provide a container for the admin-only section of the app.
type AdminContextType = {};

const AdminContext = React.createContext<AdminContextType>({});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AdminContext.Provider value={{}}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => React.useContext(AdminContext);
