import React from "react";

import { Dialog } from "@/components/common/Dialog";
import { Column } from "@/components/core/Column";
import { SettingsDisruptions } from "@/components/settings/SettingsDisruptions";
import { SettingsTheme } from "@/components/settings/SettingsTheme";
import { SettingsReset } from "@/components/settings/SettingsReset";
import { SettingsAdmin } from "@/components/settings/SettingsAdmin";
import { useSettings } from "@/components/settings/common/use-settings";
import { SettingsTitle } from "@/components/settings/SettingsTitle";
import { FixedDialogCloseButton } from "@/components/common/FixedDialogCloseButton";
import { PagePadding } from "@/components/common/PagePadding";
import { Divider } from "@/components/common/Divider";

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
