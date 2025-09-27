import { z } from "zod";

export const lineStatusIndicatorPriorities = [
  // Never shown on the line status indicator.
  "hidden",

  // e.g. Station closure.
  "very-low",

  // e.g. Delays.
  "low",

  // e.g. Buses replace trains.
  "medium",

  // e.g. Line suspended.
  "high",
] as const;

export type LineStatusIndicatorPriority =
  (typeof lineStatusIndicatorPriorities)[number];

export const summaryIconTypes = [
  "line",
  "cross",
  "altered-route",
  "traffic",
] as const;
export type SummaryIconType = (typeof summaryIconTypes)[number];

/**
 * The title, markdown description, etc. used in areas such as the disruption
 * page.
 */
export class DisruptionWriteup {
  constructor(
    /** Disruption page title. */
    readonly title: string,
    /** Disruption page body. */
    readonly bodyMarkdown: string,
    /** Summary text used on the */
    readonly summary: {
      readonly headline: string | null;
      readonly subject: string;
      readonly period: string | null;

      // TODO: Choosing the icon should probably be the responsibility of the
      // code which handles telling the <Map> what to do.
      readonly iconType: SummaryIconType;
    },
    /** Line status indicator text on the overview page. */
    readonly lineStatusIndicator: {
      readonly summary: string;
      readonly priority: LineStatusIndicatorPriority;
    },
  ) {}

  static readonly bson = z
    .object({
      title: z.string(),
      bodyMarkdown: z.string(),
      summary: z.object({
        headline: z.string().nullable(),
        subject: z.string(),
        period: z.string().nullable(),
        iconType: z.enum(summaryIconTypes),
      }),
      lineStatusIndicator: z.object({
        summary: z.string(),
        priority: z.enum(lineStatusIndicatorPriorities),
      }),
    })
    .transform(
      (x) =>
        new DisruptionWriteup(
          x.title,
          x.bodyMarkdown,
          x.summary,
          x.lineStatusIndicator,
        ),
    );

  toBson(): z.input<typeof DisruptionWriteup.bson> {
    return {
      title: this.title,
      bodyMarkdown: this.bodyMarkdown,
      summary: this.summary,
      lineStatusIndicator: this.lineStatusIndicator,
    };
  }

  static ofHighestPriority(writeups: DisruptionWriteup[]): DisruptionWriteup[] {
    if (writeups.length === 0) {
      return [];
    }

    const highestPriority =
      lineStatusIndicatorPriorities[
        Math.max(
          ...writeups.map((x) =>
            lineStatusIndicatorPriorities.indexOf(
              x.lineStatusIndicator.priority,
            ),
          ),
        )
      ];

    return writeups.filter(
      (x) => x.lineStatusIndicator.priority === highestPriority,
    );
  }

  static simple(
    title: string,
    description: string,
    icon: SummaryIconType = "cross",
    priority: LineStatusIndicatorPriority = "high",
  ) {
    return new DisruptionWriteup(
      title,
      description,
      {
        headline: null,
        subject: title,
        period: null,
        iconType: icon,
      },
      { summary: title, priority: priority },
    );
  }
}
