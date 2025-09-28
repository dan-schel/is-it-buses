import React from "react";
import axios, { AxiosError } from "axios";
import { reload } from "vike/client/router";
import { Data } from "@/pages/admin/users/+data";

import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { With } from "@/components/core/With";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteCloseCircleFill } from "@/components/icons/MingcuteCloseCircleFill";
import { MingcuteCheckCircleFill } from "@/components/icons/MingcuteCheckCircleFill";

type DiscordUserProps = {
  user: Data["discord"][number];
};

export function DiscordUser({ user }: DiscordUserProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<
    "uninvited" | "unavailable" | "invited"
  >("uninvited");

  async function handleInvite() {
    await axios
      .post(
        "/api/admin/users",
        {
          id: user.id,
          username: user.username,
        },
        { withCredentials: true },
      )
      .then(() => {
        setStatus("invited");
      })
      .catch(async (error: AxiosError<{ error: string }>) => {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
          await reload();
        } else if (statusCode === 409 || statusCode === 412) {
          setError(error.response?.data.error ?? null);
          setStatus("unavailable");
        }
      });
  }

  return (
    <Row align="center" wrap className="hover:bg-soft gap-4 rounded p-2">
      <img src={user.avatar} className="size-10 rounded-full outline" />
      <With className="flex-1">
        <Text>{user.username}</Text>
      </With>

      {status === "uninvited" ? (
        <SimpleButton text="Invite" theme="primary" onClick={handleInvite} />
      ) : (
        <Row align="center" className="gap-2">
          {status === "invited" ? (
            <>
              <MingcuteCheckCircleFill className="text-status-green size-5" />
              <Text style="green">Invite Sent</Text>
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
