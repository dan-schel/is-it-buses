import React from "react";

import { SimpleButton } from "@/components/common/SimpleButton";
import { Column } from "@/components/core/Column";
import { Link } from "@/components/core/Link";
import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { MingcuteInformationLine } from "@/components/icons/MingcuteInformationLine";
import { MingcuteToolLine } from "@/components/icons/MingcuteToolLine";
import { useSettings } from "@/components/settings/common/use-settings";
import { callApi } from "@/components/utils";
import { USERS_CREATE } from "@/shared/apis";

export function FinePrint() {
  const [settings] = useSettings();

  async function handleTest() {
    const response = await callApi(USERS_CREATE, { username: "hello" });
    console.log(response);
  }

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
        <SimpleButton
          onClick={handleTest}
          text="Test API call"
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
