import React from "react";
import { PageCenterer } from "@/components/common/PageCenterer";
import { SimpleButton } from "@/components/common/SimpleButton";
import { Row } from "@/components/core/Row";
import { With } from "@/components/core/With";
import { MingcuteLeftLine } from "@/components/icons/MingcuteLeftLine";

type BackNavigationProps = {
  name: string;
  href: string;
};

export function BackNavigation(props: BackNavigationProps) {
  return (
    <With className="bg-background border-b-soft-border border-b md:border-b-0">
      <PageCenterer>
        <Row className="px-4 py-3 md:px-6 md:pt-4 md:pb-0">
          <SimpleButton
            icon={<MingcuteLeftLine />}
            text={props.name}
            href={props.href}
          />
        </Row>
      </PageCenterer>
    </With>
  );
}
