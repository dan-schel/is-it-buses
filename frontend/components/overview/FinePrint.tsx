import React from "react";

import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { Column } from "@/frontend/components/core/Column";
import { Link } from "@/frontend/components/core/Link";
import { Row } from "@/frontend/components/core/Row";
import { Text } from "@/frontend/components/core/Text";
import { MingcuteInformationLine } from "@/frontend/components/icons/MingcuteInformationLine";
import { MingcuteToolLine } from "@/frontend/components/icons/MingcuteToolLine";
import { useSettings } from "@/frontend/components/settings/common/use-settings";

export function FinePrint() {
  const [settings] = useSettings();

  return (
    <Column className="gap-8">
      <Column className="gap-4">
        <Text style="tiny-weak">
          Not affiliated with PTV, Metro, V/Line, Transport Victoria, etc.
        </Text>
        <Text style="tiny-weak">
          For official information, visit{" "}
          <Link href="https://transport.vic.gov.au/">transport.vic.gov.au</Link>
          .
        </Text>
      </Column>
      <Row className="gap-2">
        <SimpleButton
          href="/about"
          icon={<MingcuteInformationLine />}
          text="About this site"
          layout="small"
        />
        {settings.showAdminTab && (
          <SimpleButton
            href="/admin"
            icon={<MingcuteToolLine />}
            text="Admin dashboard"
            layout="small"
          />
        )}
      </Row>
    </Column>
  );
}
