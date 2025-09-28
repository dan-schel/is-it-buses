import React from "react";

import { Row } from "@/components/core/Row";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteLeftLine } from "@/components/icons/MingcuteLeftLine";
import { Text } from "@/components/core/Text";
import { Link } from "@/components/core/Link";
import { MingcuteRightLine } from "@/components/icons/MingcuteRightLine";

export type BreadcrumbsProps = {
  paths: { name: string; href: string }[];
};

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <Row align="center" className="gap-4">
      <SimpleButton
        layout="small"
        href="/"
        text="Exit to main site"
        icon={<MingcuteLeftLine />}
      />
      <Row align="center" className="gap-1">
        {props.paths.map((p, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <MingcuteRightLine className="text-sm" />}
            {p.href != null ? (
              <Text style="small">
                <Link href={p.href}>{p.name}</Link>
              </Text>
            ) : (
              <Text style="small">{p.name}</Text>
            )}
          </React.Fragment>
        ))}
      </Row>
    </Row>
  );
}
