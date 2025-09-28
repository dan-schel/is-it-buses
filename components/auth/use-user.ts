import React from "react";
import { callApi } from "@/components/utils";
import { AUTH_LOGIN, AUTH_LOGOUT } from "@/shared/apis";
import { UserProfile } from "@/shared/user-profile";

export type UserContextContent = {
  ready: boolean;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

export const UserContext = React.createContext<UserContextContent>({
  ready: false,
  user: null,
  setUser() {},
});

export type LoginFunction = ReturnType<typeof useUser>["login"];
export type LogoutFunction = ReturnType<typeof useUser>["logout"];

export function useUser() {
  const { ready, user, setUser } = React.useContext(UserContext);

  if (!ready) {
    throw new Error("Attempting to use user outside <UserProvider>.");
  }

  async function login(username: string, password: string) {
    const result = await callApi(AUTH_LOGIN, { username, password });
    if (result.success) {
      setUser(result.profile);
    }
    return result;
  }

  async function logout() {
    const result = await callApi(AUTH_LOGOUT, {});
    if (result.success) {
      setUser(null);
    }
    return result;
  }

  return { user, login, logout } as const;
}
