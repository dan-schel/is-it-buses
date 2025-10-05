export type DisruptionSummary = {
  id: string;
  headline: string | null;
  subject: string;
  period: string | null;
  icon: "line" | "cross" | "altered-route" | "traffic";
  valid?: boolean;
};
