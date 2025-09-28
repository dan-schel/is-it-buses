import React from "react";
import { Data } from "@/pages/admin/alerts/+data";
import { useData } from "vike-react/useData";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { BackNavigation } from "@/components/navigation/BackNavigation";
import { PageCenterer } from "@/components/common/PageCenterer";
import { Row } from "@/components/core/Row";
import { PagePadding } from "@/components/common/PagePadding";
import { AlertContainer } from "@/components/alerts/AlertContainer";

export default function Page() {
  const { alerts } = useData<Data>();

  return (
    <Column>
      <BackNavigation name="Admin" href="/admin" />
      <PageCenterer>
        <PagePadding>
          <Column className="gap-4">
            <Text style="megatitle">Alerts</Text>
            <Row align="center">
              <Text>
                🚨 {alerts.length}{" "}
                {alerts.length === 1
                  ? "unprocessed alert from PTV"
                  : "unprocessed alerts from PTV"}
              </Text>
            </Row>
            <AlertContainer alerts={alerts} />
          </Column>
        </PagePadding>
      </PageCenterer>
    </Column>
  );
}
