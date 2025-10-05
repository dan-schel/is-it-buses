import React from "react";
import {
  Action,
  Button,
  extractAction,
} from "@/frontend/components/core/Button";
import { Row } from "@/frontend/components/core/Row";
import { Text } from "@/frontend/components/core/Text";
import { With } from "@/frontend/components/core/With";
import clsx from "clsx";
import { Column } from "@/frontend/components/core/Column";
import { LoadingSpinner } from "@/frontend/components/common/LoadingSpinner";

const themes = {
  default: `
    border
    not-group-disabled:bg-soft
    not-group-disabled:group-hover:bg-soft-hover
    not-group-disabled:group-active:bg-soft-active
    not-group-disabled:border-transparent
    group-disabled:border-soft-border
    group-disabled:text-foreground/50
  `,
  primary: `
    border
    not-group-disabled:bg-accent
    not-group-disabled:group-hover:bg-accent-hover
    not-group-disabled:group-active:bg-accent-active
    not-group-disabled:text-on-accent
    not-group-disabled:border-transparent
    group-disabled:border-soft-border
    group-disabled:text-foreground/50
  `,
  hover: `
    border
    not-group-disabled:group-hover:bg-soft-hover
    not-group-disabled:group-active:bg-soft-active
    not-group-disabled:border-transparent
    group-disabled:border-soft-border
    group-disabled:text-foreground/50
  `,
  error: `
    border
    not-group-disabled:bg-error
    not-group-disabled:group-hover:bg-error-hover
    not-group-disabled:group-active:bg-error-active
    not-group-disabled:text-background
    not-group-disabled:border-transparent
    group-disabled:border-soft-border
    group-disabled:text-foreground/50
  `,
};

type Content =
  | { text: string; icon?: React.ReactElement; alt?: string }
  | { text?: undefined; icon: React.ReactElement; alt: string };

type SimpleButtonProps = {
  theme?: keyof typeof themes;
  layout?: "default" | "tile" | "small";
  disabled?: boolean;
  loading?: boolean;
} & Content &
  Action;

type LayoutProps = {
  action: Action;
  theme: string;
  content: Content;
  disabled: boolean;
  loading: boolean;
};

export function SimpleButton(props: SimpleButtonProps) {
  const action = extractAction(props);
  const theme = themes[props.theme ?? "default"];
  const layout = props.layout ?? "default";
  const disabled = props.disabled ?? false;
  const loading = props.loading ?? false;

  switch (layout) {
    case "tile":
      return (
        <TileLayout
          action={action}
          theme={theme}
          content={props}
          disabled={disabled}
          loading={loading}
        />
      );
    case "small":
      return (
        <SmallLayout
          action={action}
          theme={theme}
          content={props}
          disabled={disabled}
          loading={loading}
        />
      );
    default:
      return (
        <DefaultLayout
          action={action}
          theme={theme}
          content={props}
          disabled={disabled}
          loading={loading}
        />
      );
  }
}

function DefaultLayout(props: LayoutProps) {
  const hasText = props.content.text != null;

  return (
    <Button
      {...props.action}
      alt={props.content.alt}
      disabled={props.disabled || props.loading}
    >
      <Row
        className={clsx(
          "h-8 gap-2 select-none",
          hasText ? "px-4" : "w-8",
          props.theme,
        )}
        align="center"
        justify="center"
      >
        {props.content.icon != null && (
          <With
            className={clsx("text-lg", {
              "-ml-0.5": hasText,
              invisible: props.loading,
            })}
          >
            {props.content.icon}
          </With>
        )}
        {props.content.text != null && (
          <With className={clsx({ invisible: props.loading })}>
            <Text>{props.content.text}</Text>
          </With>
        )}
        {props.loading && (
          <With className="absolute">
            <LoadingSpinner />
          </With>
        )}
      </Row>
    </Button>
  );
}

function TileLayout(props: LayoutProps) {
  return (
    <Button
      {...props.action}
      alt={props.content.alt}
      disabled={props.disabled || props.loading}
    >
      <Column
        className={clsx("gap-2 px-4 py-3 select-none", props.theme)}
        align="center"
      >
        {props.content.icon && (
          <With
            className={clsx("-ml-0.5 text-2xl", { invisible: props.loading })}
          >
            {props.content.icon}
          </With>
        )}
        {props.content.text && (
          <With className={clsx({ invisible: props.loading })}>
            <Text align="center">{props.content.text}</Text>
          </With>
        )}
      </Column>
    </Button>
  );
}

function SmallLayout(props: LayoutProps) {
  const hasText = props.content.text != null;

  return (
    <Button
      {...props.action}
      alt={props.content.alt}
      disabled={props.disabled || props.loading}
    >
      <Row
        className={clsx(
          "h-7 gap-2 select-none",
          hasText ? "px-3" : "w-8",
          props.theme,
        )}
        align="center"
        justify="center"
      >
        {props.content.icon != null && (
          <With
            className={clsx("text-sm", {
              "-ml-0.5": hasText,
              invisible: props.loading,
            })}
          >
            {props.content.icon}
          </With>
        )}
        {props.content.text != null && (
          <With className={clsx({ invisible: props.loading })}>
            <Text style="tiny">{props.content.text}</Text>
          </With>
        )}
      </Row>
    </Button>
  );
}
