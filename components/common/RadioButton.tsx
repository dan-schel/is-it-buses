import React from "react";
import {
  extractRadioControl,
  Radio,
  RadioControl,
} from "@/components/core/Radio";
import { Grid } from "@/components/core/Grid";

type RadioButtonProps = {
  children?: React.ReactElement;
  className?: string;
} & RadioControl;

export function RadioButton(props: RadioButtonProps) {
  return (
    <Radio {...extractRadioControl(props)} className={props.className}>
      <Grid columns="auto 1fr" align="center" className="gap-4">
        <RadioButtonGraphic />
        {props.children}
      </Grid>
    </Radio>
  );
}

function RadioButtonGraphic() {
  return (
    <div className="border-switch group-has-[input:checked]:border-accent -my-2.5 flex size-5 items-center justify-center rounded-full border-2 group-has-[input:disabled]:opacity-50">
      <div className="bg-accent size-2.5 rounded-full transition-transform group-has-[input:not(:checked)]:scale-0" />
    </div>
  );
}
