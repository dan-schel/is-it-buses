import React from "react";

import { Row } from "@/components/core/Row";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteLeftLine } from "@/components/icons/MingcuteLeftLine";
import { Text } from "@/components/core/Text";
import { Link } from "@/components/core/Link";
import { MingcuteRightLine } from "@/components/icons/MingcuteRightLine";

type BreadcrumbsProps = {
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
            {i !== 0 && <MingcuteRightLine className="text-xs" />}
            {p.href != null ? (
              <Text style="tiny">
                <Link href={p.href}>{p.name}</Link>
              </Text>
            ) : (
              <Text style="tiny">{p.name}</Text>
            )}
          </React.Fragment>
        ))}
      </Row>
    </Row>
  );
}
