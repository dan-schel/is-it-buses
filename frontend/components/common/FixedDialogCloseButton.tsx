import React from "react";

import { MingcuteCloseLine } from "@/frontend/components/icons/MingcuteCloseLine";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { With } from "@/frontend/components/core/With";

type FixedDialogCloseButtonProps = {
  onClick: () => void;
};

export function FixedDialogCloseButton(props: FixedDialogCloseButtonProps) {
  return (
    <With className="absolute top-4 right-4">
      <SimpleButton
        icon={<MingcuteCloseLine />}
        alt="Close"
        onClick={props.onClick}
        theme="hover"
      />
    </With>
  );
}
