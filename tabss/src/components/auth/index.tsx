import React, { createContext } from "react";
import { useInitUserQuery, type UserT } from "@/store/api/auth";
import { getOrCreateUserId } from "@/lib/utils/helper";



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