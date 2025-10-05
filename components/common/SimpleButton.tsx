import React from "react";
import { Action, Button, extractAction } from "@/components/core/Button";
import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { With } from "@/components/core/With";
import clsx from "clsx";
import { Column } from "@/components/core/Column";

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

export type SimpleButtonProps = {
  theme?: keyof typeof themes;
  layout?: "default" | "tile" | "small";
} & Content &
  Action;

type LayoutProps = {
  action: Action;
  theme: string;
  content: Content;
};

export function SimpleButton(props: SimpleButtonProps) {
  const action = extractAction(props);
  const theme = themes[props.theme ?? "default"];
  const layout = props.layout ?? "default";

  switch (layout) {
    case "tile":
      return <TileLayout action={action} theme={theme} content={props} />;
    case "small":
      return <SmallLayout action={action} theme={theme} content={props} />;
    default:
      return <DefaultLayout action={action} theme={theme} content={props} />;
  }
}

function DefaultLayout(props: LayoutProps) {
  const hasText = props.content.text != null;

  return (
    <Button {...props.action} alt={props.content.alt}>
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
          <With className={clsx("text-lg", { "-ml-0.5": hasText })}>
            {props.content.icon}
          </With>
        )}
        {props.content.text != null && <Text>{props.content.text}</Text>}
      </Row>
    </Button>
  );
}

function TileLayout(props: LayoutProps) {
  return (
    <Button {...props.action} alt={props.content.alt}>
      <Column
        className={clsx("gap-2 px-4 py-3 select-none", props.theme)}
        align="center"
      >
        {props.content.icon && (
          <With className="-ml-0.5 text-2xl">{props.content.icon}</With>
        )}
        {props.content.text && <Text align="center">{props.content.text}</Text>}
      </Column>
    </Button>
  );
}

function SmallLayout(props: LayoutProps) {
  const hasText = props.content.text != null;

  return (
    <Button {...props.action} alt={props.content.alt}>
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
          <With className={clsx("text-sm", { "-ml-0.5": hasText })}>
            {props.content.icon}
          </With>
        )}
        {props.content.text != null && (
          <Text style="tiny">{props.content.text}</Text>
        )}
      </Row>
    </Button>
  );
}
