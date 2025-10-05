import React from "react";

type SelectOption<T> = { label: string; value: T };

type SelectProps<T> = {
  id?: string;
  name?: string;
  value?: T | null;
  options: SelectOption<T>[];
  onChange?: (e: T) => void;
};

/**
 * Styled select component
 *
 * To enforce the values of the options provided, provide the component with a type as follows
 * `<Select<T> {...} />`
 */
export function Select<T extends string>({
  id,
  name,
  options,
  value,
  onChange,
}: SelectProps<T>) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange?.(event.target.value as T);
  }

  return (
    <select
      id={id}
      name={name}
      value={value ?? undefined}
      onChange={handleChange}
      className="focus:border-b-accent-active hover:border-b-accent-hover border-b-soft-border h-6 cursor-pointer border-y-2 border-transparent focus:outline-0"
    >
      {options.map((x, i) => (
        <option key={i} value={x.value} className="bg-background!">
          {x.label}
        </option>
      ))}
    </select>
  );
}
