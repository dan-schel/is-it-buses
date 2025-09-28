import React from "react";
import { Column } from "@/components/core/Column";
import { Text } from "@/components/core/Text";
import { listifyAnd } from "@dan-schel/js-utils";
import { Link } from "@/components/core/Link";
import { Spacer } from "@/components/core/Spacer";
import { PtvPreview } from "@/pages/admin/alerts/@id/PtvPreview";
import { With } from "@/components/core/With";
import { MingcuteAlertLine } from "@/components/icons/MingcuteAlertLine";

export type AlertDataProps = {
  data: {
    title: string;
    description: string;
    url: string;
    startsAt: string | null;
    endsAt: string | null;
    affectedLines: {
      name: string;
    }[];
    affectedStations: {
      name: string;
    }[];
    urlPreview: { html: string } | { error: string };
  };
};

export function AlertData({ data }: AlertDataProps) {
  return (
    <Column>
      <Column className="gap-4">
        <Text>{data.title}</Text>
        <Text>{data.description}</Text>
        <Text>Starts at: {data.startsAt}</Text>
        <Text>Ends at: {data.endsAt}</Text>

        <Text>
          Affected lines:{" "}
          {data.affectedLines.length === 0 ? (
            <i>[None]</i>
          ) : (
            listifyAnd(data.affectedLines.map((x) => x.name))
          )}
        </Text>
        <Text>
          Affected stations:{" "}
          {data.affectedStations.length === 0 ? (
            <i>[None]</i>
          ) : (
            listifyAnd(data.affectedStations.map((x) => x.name))
          )}
        </Text>
      </Column>

      <Spacer h="8" />
      <hr className="border-soft-border" />
      <Spacer h="8" />

      <Text style="subtitle">Additional details</Text>
      <Spacer h="2" />
      <Text style="tiny-weak">
        <Link href={data.url} target="_blank">
          {data.url}
        </Link>
      </Text>
      <Spacer h="6" />
      <Column className="border-soft-border divide-soft-border bg-soft divide-y overflow-x-scroll rounded-md border">
        {"error" in data.urlPreview && (
          <Column className="gap-2 px-4 py-8" align="center">
            <With className="text-2xl">
              <MingcuteAlertLine />
            </With>
            <Text>
              <b>Error:</b> {data.urlPreview.error}
            </Text>
          </Column>
        )}
        {"html" in data.urlPreview && (
          <PtvPreview html={data.urlPreview.html} />
        )}
      </Column>
    </Column>
  );
}
