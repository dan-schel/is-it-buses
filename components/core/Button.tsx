import React from "react";

// TODO: Codify routes rather than allowing any string.
export type Action =
  | {
      onClick: () => void;

      href?: undefined;
      submit?: undefined;
      target?: undefined;
    }
  | {
      href: string;
      target?: React.HTMLAttributeAnchorTarget;

      onClick?: undefined;
      submit?: undefined;
    }
  | {
      submit: true;

      onClick?: undefined;
      href?: undefined;
      target?: undefined;
    };

export function extractAction(props: Action): Action {
  if (props.onClick != null) {
    return { onClick: props.onClick };
  } else if (props.href != null) {
    return { href: props.href, target: props.target };
  } else if (props.submit === true) {
    return { submit: true };
  } else {
    throw new Error("Invalid action");
  }
}

type ButtonProps = {
  children: React.ReactElement;
  alt?: string;
  disabled?: boolean;
} & Action;

/**
 * A clickable element (supports `onClick` or `href`).
 *
 * Rules:
 * - Are you sure you don't want `<SimpleButton>`?
 * - Child elements should use `group-hover` and `group-active` for styling,
 *   over `hover` and `active`.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Button(props: ButtonProps) {
  if (props.onClick != null || props.submit) {
    const type = props.submit === true ? "submit" : "button";
    return (
      <button
        className="group grid"
        onClick={props.onClick}
        type={type}
        title={props.alt}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    );
  } else {
    return (
      <a
        className="group grid"
        href={!props.disabled ? props.href : undefined}
        title={props.alt}
        target={props.target}
        data-disabled={props.disabled}
      >
        {props.children}
      </a>
    );
  }
}
