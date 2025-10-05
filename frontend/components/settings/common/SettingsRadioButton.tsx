import React from "react";
import { RadioButton } from "@/frontend/components/common/RadioButton";
import {
  RadioControl,
  extractRadioControl,
} from "@/frontend/components/core/Radio";
import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";

type SettingsRadioButtonProps = {
  title: string;
  description?: string;
} & RadioControl;

export function SettingsRadioButton(props: SettingsRadioButtonProps) {
  return (
    <RadioButton
      {...extractRadioControl(props)}
      className="hover:bg-soft-hover -mx-6 -my-3 px-6 py-3"
    >
      <Column className="gap-2 select-none">
        <Text>{props.title}</Text>
        {props.description != null && (
          <Text style="tiny-weak">{props.description}</Text>
        )}
      </Column>
    </RadioButton>
  );
}
