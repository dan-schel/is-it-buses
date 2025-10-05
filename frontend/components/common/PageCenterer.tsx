import React from "react";
import { With } from "@/frontend/components/core/With";

type PageCentererProps = {
  children: React.ReactElement;
};

export function PageCenterer(props: PageCentererProps) {
  return (
    <div className="grid grid-cols-[0px_1fr_0px] lg:grid-cols-[1fr_64rem_1fr]">
      <With className="col-start-2">{props.children}</With>
    </div>
  );
}
