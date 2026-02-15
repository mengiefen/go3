import React, { createContext } from "react";
import { useInitUserQuery, type UserT } from "../../redux/api/auth";
import { getOrCreateUserId } from "../../lib/helper";



const UserIdContext = createContext<UserT | undefined>(undefined);

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userUID = getOrCreateUserId();

  const { data } = useInitUserQuery(userUID)

  return (
    <UserIdContext.Provider
      value={data}
    >
      {children}
    </UserIdContext.Provider>
  );
};