import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/change-password/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Input } from "@/components/core/Input";
import { SimpleButton } from "@/components/common/SimpleButton";
import { useMutation } from "@/components/utils";
import { USERS_CHANGE_PASSWORD } from "@/shared/apis";
import { standardAuthErrorDisplayStrings } from "@/shared/apis/lib";
import { MingcuteCheckLine } from "@/components/icons/MingcuteCheckLine";
import { Row } from "@/components/core/Row";

export default function Page() {
  const data = useData<Data>();

  const [isPasswordChanged, setIsPasswordChanged] = React.useState(false);

  function handlePasswordChanged() {
    setIsPasswordChanged(true);
  }

  return (
    <UnwrapAuthProtectedData
      data={data}
      content={(_data) => (
        <PageCenterer>
          <PagePadding>
            <Column className="gap-8">
              <Breadcrumbs
                paths={[
                  { name: "Admin dashboard", href: "/admin" },
                  { name: "Change password", href: "/admin/change-password" },
                ]}
              />
              <Text style="megatitle">Change password</Text>
              {!isPasswordChanged ? (
                <ChangePasswordForm onPasswordChanged={handlePasswordChanged} />
              ) : (
                <SuccessView />
              )}
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}

function ChangePasswordForm(props: { onPasswordChanged: () => void }) {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const { call, loading } = useMutation(USERS_CHANGE_PASSWORD);
  const [error, setError] = React.useState<string | null>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const result = await call({ oldPassword, newPassword });

      if ("data" in result) {
        props.onPasswordChanged();
      } else {
        const message = {
          ...standardAuthErrorDisplayStrings,
          "incorrect-old-password": "Current password is incorrect.",
          "invalid-new-password":
            "Your new password must be at least 8 characters.",
          "is-superadmin":
            "Superadmins cannot change their password via the UI.",
        }[result.error];

        setError(message);
      }
    } catch (e) {
      console.warn(e);
      setError("Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Column className="max-w-120 gap-8" align="left">
        <Column as="label" className="w-full gap-2">
          <Text>Current password</Text>
          <Input value={oldPassword} onChange={setOldPassword} password />
        </Column>
        <Column as="label" className="w-full gap-2">
          <Text>New password</Text>
          <Input value={newPassword} onChange={setNewPassword} password />
        </Column>
        <Column as="label" className="w-full gap-2">
          <Text>Confirm password</Text>
          <Input
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
            password
          />
        </Column>
        {error != null && <Text style="small-red">{error}</Text>}
        <SimpleButton
          text="Change password"
          theme="primary"
          loading={loading}
          submit
        />
      </Column>
    </form>
  );
}

function SuccessView() {
  return (
    <Column align="left" className="gap-8">
      <Row align="center" className="gap-2">
        <MingcuteCheckLine className="text-lg" />
        <Text>Password changed successfully</Text>
      </Row>
      <SimpleButton text="Done" theme="primary" href="/admin" />
    </Column>
  );
}
