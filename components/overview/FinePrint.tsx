import React from "react";

import { SimpleButton } from "@/components/common/SimpleButton";
import { Column } from "@/components/core/Column";
import { Link } from "@/components/core/Link";
import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { MingcuteInformationLine } from "@/components/icons/MingcuteInformationLine";
import { MingcuteToolLine } from "@/components/icons/MingcuteToolLine";
import { useSettings } from "@/components/settings/use-settings";

export function FinePrint() {
  const [settings] = useSettings();

  return (
    <Column className="gap-8">
      <Column className="gap-4">
        <Text style="tiny-weak">
          Not affiliated with PTV, Metro, V/Line, Transport Victoria, etc.
        </Text>
        <Text style="tiny-weak">
          Visit{" "}
          <Link href="https://transport.vic.gov.au/">transport.vic.gov.au</Link>{" "}
          for official information.
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
