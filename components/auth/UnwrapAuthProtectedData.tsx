import React from "react";

import { AuthProtectedData, StandardAuthError } from "@/shared/apis/lib";
import { Text } from "@/components/core/Text";
import { useUser } from "@/components/auth/use-user";
import { UserProfile } from "@/shared/user-profile";
import { Column } from "@/components/core/Column";
import { LoginForm } from "@/components/auth/LoginForm";
import { reload } from "vike/client/router";

export type UnwrapAuthProtectedDataProps<T> = {
  data: AuthProtectedData<T>;
  content: (data: T, user: UserProfile) => React.ReactNode;
};

const errorMessages = {
  "not-authenticated": "You must be logged in to view this.",
  "invalid-token": "Your session expired - please log in again.",
  "insufficient-permissions": "You don't have permission to view this.",
  "": "Something went wrong",
} as const;

const requiresLogin: string[] = [
  "not-authenticated",
  "invalid-token",
] satisfies StandardAuthError[];

export function UnwrapAuthProtectedData<T>(
  props: UnwrapAuthProtectedDataProps<T>,
) {
  const { data, error } = props.data;
  const { user } = useUser();

  if (data != null && user != null) return props.content(data, user);

  const errorMessage = errorMessages[error ?? ""];
  const showLoginForm = requiresLogin.includes(error ?? "");

  async function handleSuccessfulLogin() {
    await reload();
  }

  return (
    <Column className="gap-8">
      <Text>{errorMessage}</Text>
      {showLoginForm && <LoginForm onLoginSuccess={handleSuccessfulLogin} />}
    </Column>
  );
}
