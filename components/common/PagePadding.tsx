import React from "react";
import { With } from "@/components/core/With";
import clsx from "clsx";

type PagePaddingProps = {
  children: React.ReactElement;
  excludingTop?: boolean;
};

export function PagePadding(props: PagePaddingProps) {
  return (
    <With
      className={clsx("px-6 pb-12", {
        "pt-12": !(props.excludingTop ?? false),
      })}
    >
      {props.children}
    </With>
  );
}
