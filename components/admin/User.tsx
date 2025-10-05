import React from "react";

import { Text } from "@/components/core/Text";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteDelete2Line } from "@/components/icons/MingcuteDelete2Line";
import { useUser } from "@/components/auth/use-user";
import { useMutation } from "@/components/utils";
import { USERS_DELETE } from "@/shared/apis";
import { standardAuthErrorDisplayStrings } from "@/shared/apis/lib";
import { Grid } from "@/components/core/Grid";
import { With } from "@/components/core/With";

export type UserProps = {
  user: {
    id: string;
    username: string;
    type: string;
    isSuperadmin: boolean;
  };
};

export function UserRow(props: UserProps) {
  const { user: currentUser } = useUser();
  const [deleted, setDeleted] = React.useState(false);
  const { call, loading } = useMutation(USERS_DELETE);

  const isCurrentUser = props.user.id === currentUser?.id;

  async function handleDelete() {
    try {
      const result = await call({ id: props.user.id });
      if ("data" in result) {
        setDeleted(true);
      } else {
        // TODO: [DS] Use a toast.
        alert(
          {
            ...standardAuthErrorDisplayStrings,
            "is-superadmin": "The superadmin user cannot be deleted.",
            "user-not-found": "User not found.",
            "is-you": "You cannot delete yourself.",
          }[result.error],
        );
      }
    } catch (e) {
      console.warn(e);

      // TODO: [DS] Use a toast.
      alert("Something went wrong.");
    }
  }

  return (
    <Grid columns="subgrid" className="col-span-3">
      <Text>
        <b>{props.user.username}</b>
        {isCurrentUser ? " (You)" : ""}
      </Text>
      <Text>{props.user.type}</Text>
      <With className="justify-items-end">
        <SimpleButton
          onClick={handleDelete}
          text={deleted ? "Deleted" : "Delete"}
          icon={<MingcuteDelete2Line />}
          disabled={deleted || isCurrentUser || props.user.isSuperadmin}
          loading={loading}
        />
      </With>
    </Grid>
  );
}
