'use client';

import * as React from 'react';

type Permissions = {
  customer_support: boolean;
  user_verification: boolean;
  deposit_approval: boolean;
} | null;

type ModeratorContextType = {
  permissions: Permissions;
};

const ModeratorContext = React.createContext<ModeratorContextType>({
  permissions: null,
});

export const ModeratorProvider = ({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions: Permissions;
}) => {
  return (
    <ModeratorContext.Provider value={{permissions}}>
      {children}
    </ModeratorContext.Provider>
  );
};

export const useModerator = () => React.useContext(ModeratorContext);
