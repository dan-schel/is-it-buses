import React from "react";
import axios, { AxiosError } from "axios";
import { Data } from "@/pages/admin/users/+data";
import { reload, navigate } from "vike/client/router";

import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteCheckCircleFill } from "@/components/icons/MingcuteCheckCircleFill";
import { MingcuteCloseCircleFill } from "@/components/icons/MingcuteCloseCircleFill";

type AdminUserProps = {
  user: Data["admins"][number];
};

export function AdminUser({ user }: AdminUserProps) {
  const [status, setStatus] = React.useState<"active" | "failed" | "success">(
    "active",
  );
  const [error, setError] = React.useState<string | null>(null);

  async function removeAdmin() {
    await axios
      .delete(`/api/admin/users/${user.id}`, { withCredentials: true })
      .then(() => setStatus("success"))
      .catch(async (error: AxiosError<{ error: string }>) => {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
          await reload();
        } else if (statusCode === 403) {
          await navigate("/admin");
        } else {
          setStatus("failed");
          setError(
            error.response?.data.error ??
              "An error occurred, please try again later",
          );
        }
      });
  }

  return (
    <Row
      align="center"
      justify="space-between"
      className="hover:bg-soft h-10 rounded p-2"
    >
      <Text>{user.username}</Text>

      {status === "active" ? (
        <SimpleButton theme="error" text="Remove Admin" onClick={removeAdmin} />
      ) : (
        <Row align="center" className="gap-2">
          {status === "success" ? (
            <>
              <MingcuteCheckCircleFill className="text-status-green size-5" />
              <Text style="green">Admin Removed</Text>
            </>
          ) : (
            <>
              <MingcuteCloseCircleFill className="text-error size-5" />
              <Text style="red">{error}</Text>
            </>
          )}
        </Row>
      )}
    </Row>
  );
}
