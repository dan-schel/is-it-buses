import React from "react";
import clsx from "clsx";

type CheckboxProps = {
  className?: string;
  children?: React.ReactNode;
} & CheckboxControl;

export type CheckboxControl = {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * A checkbox without any styling.
 *
 * Rules:
 * - Are you sure you don't want `<Switch>`?
 * - Child elements should use `group-has-[input:checked]` and
 *   `group-has-[input:disabled]` for styling.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Checkbox(props: CheckboxProps) {
  return (
    <label className={clsx("group grid cursor-pointer", props.className)}>
      <input
        type="checkbox"
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

export function extractCheckboxControl(
  props: CheckboxControl,
): CheckboxControl {
  return {
    checked: props.checked,
    disabled: props.disabled,
    onChange: props.onChange,
  };
}
