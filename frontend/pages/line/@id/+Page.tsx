import React from "react";

import { useData } from "vike-react/useData";
import { Data } from "@/frontend/pages/line/@id/+data";
import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { BackNavigation } from "@/frontend/components/navigation/BackNavigation";
import { Calendar } from "@/frontend/components/calendar/Calendar";
import { ActiveDisruption } from "@/frontend/pages/line/@id/ActiveDisruption";
import { UpcomingDisruption } from "@/frontend/pages/line/@id/UpcomingDisruption";
import { MingcuteCheckCircleFill } from "@/frontend/components/icons/MingcuteCheckCircleFill";
import { Row } from "@/frontend/components/core/Row";
import { With } from "@/frontend/components/core/With";

export default function Page() {
  const { line } = useData<Data>();

  return (
    <Column>
      <BackNavigation name="Overview" href="/" />
      <With flexGrow="1">
        <PageCenterer>
          <PagePadding>
            {line != null ? (
              <Column className="gap-4">
                <Text style="megatitle">Is it buses...</Text>
                <Text>
                  on the <b>{line.name}</b> line?
                </Text>

                {line.active.length > 0 ? (
                  <Column>
                    {line.active.map((x) => (
                      <ActiveDisruption
                        key={x.id}
                        lineNumber={line.id}
                        disruption={x}
                      />
                    ))}
                  </Column>
                ) : (
                  <Column className="gap-3 py-2">
                    <Row align="center" className="text-status-green gap-2">
                      <MingcuteCheckCircleFill className="size-10" />
                      <Text style="custom" className="text-xl">
                        Trains are running
                      </Text>
                    </Row>
                    <Text>There are no reported disruptions.</Text>
                  </Column>
                )}

                <hr className="border-soft-border" />

                <Column className="gap-6">
                  <Text style="subtitle">Buses replace trains...</Text>

                  <Calendar data={line.calendar} />
                </Column>

                <hr className="border-soft-border" />

                <Text style="subtitle">Upcoming disruptions</Text>
                <Column className="divide-soft-border divide-y">
                  {line.upcoming.length > 0 ? (
                    line.upcoming.map((x) => (
                      <UpcomingDisruption
                        key={x.id}
                        lineNumber={line.id}
                        disruption={x}
                      />
                    ))
                  ) : (
                    <Text>There are no disruptions coming up!</Text>
                  )}
                </Column>
              </Column>
            ) : (
              <Column align="center" justify="center" className="h-full gap-4">
                <Text align="center">
                  It looks like your train has gone of its rails because we
                  couldn&apos;t find which line you&apos;ve ended up at.
                </Text>
              </Column>
            )}
          </PagePadding>
        </PageCenterer>
      </With>
    </Column>
  );
}
