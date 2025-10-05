import React from "react";

import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";

export function NotFound() {
  return (
    <Column align="center" justify="center" className="h-full gap-4">
      <Text align="center">
        {
          "It looks like the train left without you because we couldn't find the disruption you were looking for."
        }
      </Text>
    </Column>
  );
}
