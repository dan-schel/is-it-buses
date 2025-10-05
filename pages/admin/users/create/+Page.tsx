import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/users/create/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Input } from "@/components/core/Input";
import { Select } from "@/components/common/Select";
import { SimpleButton } from "@/components/common/SimpleButton";
import { Row } from "@/components/core/Row";
import { PermissionLevel } from "@/shared/apis/users/create";
import { useMutation } from "@/components/utils";
import { USERS_CREATE } from "@/shared/apis";
import { standardAuthErrorDisplayStrings } from "@/shared/apis/lib";
import { MingcuteCheckLine } from "@/components/icons/MingcuteCheckLine";

const permissionsLabels = [
  {
    value: "admin" as const,
    label: "Admin (allowed to manage users)",
  },
  {
    value: "standard" as const,
    label: "Standard",
  },
];

export default function Page() {
  const data = useData<Data>();

  const [password, setPassword] = React.useState<string | null>(null);
  const { call, loading } = useMutation(USERS_CREATE);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(username: string, permissions: PermissionLevel) {
    try {
      setError(null);
      const result = await call({ username, permissions });

      if ("data" in result) {
        setPassword(result.data.password);
      } else {
        const message = {
          ...standardAuthErrorDisplayStrings,
          "username-taken": "That username is already taken.",
        }[result.error];

        setError(message);
      }
    } catch (e) {
      console.warn(e);
      setError("Something went wrong.");
    }
  }

  return (
    // Replace this (and the needless +data.ts hook) with a client side check
    // for whether this user has enough permission via the frontend UserProfile.
    // The error message should look the same as what UnwrapAuthProtectedData
    // provides though. If the page was loaded by a logged out user, or a user
    // with an invalid token, the UserProfile will be null, so we can show a
    // login form in that case, just like UnwrapAuthProtectedData would. I guess
    // we should add the error type to the ClientPageContext so that it can
    // distinguish between not authed and invalid token, and therefore show the
    // correct message.
    <UnwrapAuthProtectedData
      data={data}
      content={(_data, _user) => (
        <PageCenterer>
          <PagePadding>
            <Column className="gap-8">
              <Breadcrumbs
                paths={[
                  { name: "Admin dashboard", href: "/admin" },
                  { name: "Users", href: "/admin/users" },
                  { name: "Create new user", href: "/admin/users/create" },
                ]}
              />
              <Text style="megatitle">Create new user</Text>
              {password == null ? (
                <CreateUserForm
                  loading={loading}
                  error={error}
                  onSubmit={handleSubmit}
                />
              ) : (
                <UserCreatedView password={password} />
              )}
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}

function CreateUserForm({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean;
  error: string | null;
  onSubmit: (username: string, permissions: PermissionLevel) => Promise<void>;
}) {
  const [username, setUsername] = React.useState("");
  const [permissions, setPermissions] =
    React.useState<PermissionLevel>("standard");

  async function handleCreate() {
    await onSubmit(username, permissions);
  }

  return (
    <Column align="left" className="max-w-120 gap-8">
      <Column as="label" className="w-full gap-2">
        <Text>Username</Text>
        <Input value={username} onChange={setUsername} />
      </Column>
      <Column as="label" className="gap-2">
        <Text>Password</Text>
        <Text style="small">
          [Will be randomly generated when the user is created.]
        </Text>
      </Column>
      <Column as="label" className="w-full gap-2">
        <Text>Permissions</Text>
        <Select
          options={permissionsLabels}
          value={permissions}
          onChange={setPermissions}
        />
      </Column>
      {error != null && <Text style="small-red">{error}</Text>}
      <SimpleButton
        text="Create"
        theme="primary"
        onClick={handleCreate}
        loading={loading}
      />
    </Column>
  );
}

function UserCreatedView({ password }: { password: string }) {
  return (
    <Column align="left" className="gap-8">
      <Row align="center" className="gap-2">
        <MingcuteCheckLine className="text-lg" />
        <Text>New user created successfully</Text>
      </Row>
      <Text>
        Their password is: <b>{password}</b>
      </Text>
      <Text>
        (There&apos;s no way to view this password again after you&apos;ve
        dismissed this page, so be sure to note it down now and pass it on to
        the new user so they can login!)
      </Text>
      <SimpleButton
        icon={<MingcuteCheckLine />}
        text="Done"
        theme="primary"
        href="/admin/users"
      />
    </Column>
  );
}
