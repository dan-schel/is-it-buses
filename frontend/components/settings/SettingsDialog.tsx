import React from "react";

import { Dialog } from "@/frontend/components/common/Dialog";
import { Column } from "@/frontend/components/core/Column";
import { SettingsDisruptions } from "@/frontend/components/settings/SettingsDisruptions";
import { SettingsTheme } from "@/frontend/components/settings/SettingsTheme";
import { SettingsReset } from "@/frontend/components/settings/SettingsReset";
import { SettingsAdmin } from "@/frontend/components/settings/SettingsAdmin";
import { useSettings } from "@/frontend/components/settings/common/use-settings";
import { SettingsTitle } from "@/frontend/components/settings/SettingsTitle";
import { FixedDialogCloseButton } from "@/frontend/components/common/FixedDialogCloseButton";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { Divider } from "@/frontend/components/common/Divider";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDialog(props: SettingsDialogProps) {
  const [settings] = useSettings();

  const [showAdminTabSetting, setShowAdminTabSetting] = React.useState(
    settings.showAdminTab,
  );

  function handleRepeatedTitleClicks() {
    setShowAdminTabSetting(true);
  }

  return (
    <Dialog open={props.open}>
      <PagePadding>
        <Column className="gap-8">
          <FixedDialogCloseButton onClick={props.onClose} />
          <SettingsTitle onRepeatedClicks={handleRepeatedTitleClicks} />
          <Column className="gap-8">
            <SettingsDisruptions />
            <Divider />
            <SettingsTheme />
            {showAdminTabSetting && (
              <>
                <Divider />
                <SettingsAdmin />
              </>
            )}
            <Divider />
            <SettingsReset />
          </Column>
        </Column>
      </PagePadding>
    </Dialog>
  );
}
