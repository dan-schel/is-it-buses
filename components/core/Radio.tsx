import React from "react";
import clsx from "clsx";

type RadioProps = {
  className?: string;
  children?: React.ReactNode;
} & RadioControl;

export type RadioControl = {
  group: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * A radio button without any styling.
 *
 * Rules:
 * - Are you sure you don't want `<RadioButton>`?
 * - Child elements should use `group-has-[input:checked]` and
 *   `group-has-[input:disabled]` for styling.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Radio(props: RadioProps) {
  return (
    <label className={clsx("group grid cursor-pointer", props.className)}>
      <input
        type="radio"
        name={props.group}
        autoComplete="off"
        className="sr-only"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        disabled={props.disabled}
      />
      {props.children}
    </label>
  );
}

export function extractRadioControl(props: RadioControl): RadioControl {
  return {
    group: props.group,
    checked: props.checked,
    disabled: props.disabled,
    onChange: props.onChange,
  };
}
