import React from "react";

import { Text } from "@/frontend/components/core/Text";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { MingcuteDelete2Line } from "@/frontend/components/icons/MingcuteDelete2Line";
import { useUser } from "@/frontend/components/auth/use-user";
import { useMutation } from "@/frontend/components/utils";
import { USERS_DELETE } from "@/shared/apis";
import { standardAuthErrorDisplayStrings } from "@/shared/apis/lib";
import { Grid } from "@/frontend/components/core/Grid";
import { With } from "@/frontend/components/core/With";

type UserProps = {
  user: {
    id: string;
    username: string;
    type: string;
    canBeDeleted: boolean;
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
          disabled={deleted || !props.user.canBeDeleted}
          loading={loading}
        />
      </With>
    </Grid>
  );
}
