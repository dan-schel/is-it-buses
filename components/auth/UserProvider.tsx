import React from "react";

import { usePageContext } from "vike-react/usePageContext";
import { UserContext } from "@/components/auth/use-user";
import { UserProfile } from "@/shared/user-profile";

export type UserProviderProps = {
  children: React.ReactNode;
};

export function UserProvider(props: UserProviderProps) {
  const { user: userJson } = usePageContext().client;

  const [user, setUser] = React.useState(
    UserProfile.json.nullable().parse(userJson),
  );

  return (
    <UserContext.Provider value={{ ready: true, user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
