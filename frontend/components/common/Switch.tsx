import React from "react";
import {
  Checkbox,
  CheckboxControl,
  extractCheckboxControl,
} from "@/frontend/components/core/Checkbox";
import { Grid } from "@/frontend/components/core/Grid";

type SwitchProps = {
  children?: React.ReactElement;
  className?: string;
} & CheckboxControl;

export function Switch(props: SwitchProps) {
  return (
    <Checkbox {...extractCheckboxControl(props)} className={props.className}>
      <Grid columns="1fr auto" align="center" className="gap-4">
        {props.children}
        <SwitchGraphic />
      </Grid>
    </Checkbox>
  );
}

function SwitchGraphic() {
  return (
    <div className="bg-switch group-has-[input:checked]:bg-accent group-hover:bg-switch-hover group-has-[input:checked]:group-hover:bg-accent-hover -my-2.5 h-5 w-9 rounded-full p-0.5 group-has-[input:disabled]:opacity-50">
      <div className="bg-switch-knob size-4 rounded-full transition-transform ease-in-out group-has-[input:checked]:translate-x-full" />
    </div>
  );
}
