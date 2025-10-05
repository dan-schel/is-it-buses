import React from "react";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
};

// TODO: [DS] If this remains a core component, document it in the style of the
// other core components.
export function Input(props: InputProps) {
  return (
    <input
      type={(props.password ?? false) ? "password" : "text"}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      // TODO: [DS] Temporary!
      className="border-switch focus-within:border-accent w-full appearance-none rounded-sm border-2 px-3 py-1 outline-none"
    />
  );
}
