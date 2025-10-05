import React from "react";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { MingcuteSettings7Line } from "@/frontend/components/icons/MingcuteSettings7Line";
import { SettingsDialog } from "@/frontend/components/settings/SettingsDialog";

export function OpenSettingsButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {open && <SettingsDialog open onClose={() => setOpen(false)} />}
      <SimpleButton
        theme="hover"
        icon={<MingcuteSettings7Line />}
        alt="Settings"
        onClick={() => setOpen(true)}
      />
    </>
  );
}
