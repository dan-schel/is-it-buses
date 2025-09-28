// import { PageContext } from "vike/types";
// import { JsonSerializable } from "@/shared/json-serializable";
// import { AlertPreview } from "@/shared/types/alert-data";

// export type Data = {
//   alerts: AlertPreview;
// };

// export async function data(
//   pageContext: PageContext,
// ): Promise<Data & JsonSerializable> {
//   const { app } = pageContext.custom;

//   const inbox = await app.alerts.allInInbox();

//   return {
//     alerts: inbox.map((alert) => ({
//       id: alert.id,
//       title: alert.data.title,
//     })),
//   };
// }
