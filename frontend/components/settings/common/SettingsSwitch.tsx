import React from "react";
import { Switch } from "@/frontend/components/common/Switch";
import {
  CheckboxControl,
  extractCheckboxControl,
} from "@/frontend/components/core/Checkbox";
import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";

type SettingsSwitchProps = {
  title: string;
  description?: string;
} & CheckboxControl;

export function SettingsSwitch(props: SettingsSwitchProps) {
  return (
    <Switch
      {...extractCheckboxControl(props)}
      className="hover:bg-soft-hover -mx-6 -my-3 px-6 py-3"
    >
      <Column className="gap-2 select-none">
        <Text>{props.title}</Text>
        {props.description != null && (
          <Text style="tiny-weak">{props.description}</Text>
        )}
      </Column>
    </Switch>
  );
}
