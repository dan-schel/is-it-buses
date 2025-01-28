import React from "react";
import { Text } from "../../components/core/Text";
import { Column } from "../../components/core/Column";
import { SimpleButton } from "../../components/common/SimpleButton";
import { PagePadding } from "../../components/common/PagePadding";
import { PageCenterer } from "../../components/common/PageCenterer";

export default function Page() {
  return (
    <PageCenterer>
      <PagePadding>
        <Column className="gap-4" align="left">
          <Text style="title">Is it buses?</Text>
          <Text>Maybe. 🤷</Text>
          <SimpleButton href="/disruption/1" text="View a disruption" />
          <SimpleButton href="/line/17" text="Sunbury line" />
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
