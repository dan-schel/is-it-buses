import "@/frontend/layouts/tailwind.css";

import React from "react";

import { Column } from "@/frontend/components/core/Column";
import { SettingsProvider } from "@/frontend/components/settings/common/SettingsProvider";
import { UserProvider } from "@/frontend/components/auth/UserProvider";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isReactElement(children)) {
    throw new Error("Layout expects one child.");
  }

  return (
    <Column className="min-h-screen">
      <SettingsProvider>
        <UserProvider>{children}</UserProvider>
      </SettingsProvider>
    </Column>
  );
}

function isReactElement(node: React.ReactNode): node is React.ReactElement {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "props" in node &&
    "key" in node
  );
}
