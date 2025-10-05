import React from "react";

import { MingcuteCloseLine } from "@/components/icons/MingcuteCloseLine";
import { SimpleButton } from "@/components/common/SimpleButton";
import { With } from "@/components/core/With";

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
