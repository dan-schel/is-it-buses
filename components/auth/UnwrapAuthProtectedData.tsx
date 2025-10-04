import React from "react";

import {
  AuthProtectedData,
  StandardAuthError,
  standardAuthErrorDisplayStrings,
} from "@/shared/apis/lib";
import { Text } from "@/components/core/Text";
import { useUser } from "@/components/auth/use-user";
import { UserProfile } from "@/shared/user-profile";
import { Column } from "@/components/core/Column";
import { LoginForm } from "@/components/auth/LoginForm";
import { reload } from "vike/client/router";
import { MingcuteInformationLine } from "@/components/icons/MingcuteInformationLine";
import { Row } from "@/components/core/Row";
import { PageCenterer } from "@/components/common/PageCenterer";
import { PagePadding } from "@/components/common/PagePadding";

export type UnwrapAuthProtectedDataProps<T> = {
  data: AuthProtectedData<T>;
  content: (data: T, user: UserProfile) => React.ReactNode;
};

const errorMessages = {
  ...standardAuthErrorDisplayStrings,
  "": "Something went wrong",
} as const;

const requiresLogin: string[] = [
  "not-authenticated",
  "invalid-token",
] satisfies StandardAuthError[];

export function UnwrapAuthProtectedData<T>(
  props: UnwrapAuthProtectedDataProps<T>,
) {
  const result = props.data;
  const { user } = useUser();

  if ("data" in result && user != null) return props.content(result.data, user);

  const error = "error" in result ? result.error : "";

  const errorMessage = errorMessages[error];
  const showLoginForm = requiresLogin.includes(error);

  async function handleSuccessfulLogin() {
    await reload();
  }

  return (
    <PageCenterer>
      <PagePadding>
        <Column className="gap-8">
          <Text style="megatitle">Admin dashboard</Text>
          <Row className="bg-soft h-12 gap-2 px-4" align="center">
            <MingcuteInformationLine className="text-lg" />
            <Text>{errorMessage}</Text>
          </Row>
          {showLoginForm && (
            <LoginForm onLoginSuccess={handleSuccessfulLogin} />
          )}
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
