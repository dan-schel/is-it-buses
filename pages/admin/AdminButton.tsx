// import React from "react";

// import { Row } from "@/components/core/Row";
// import { Text } from "@/components/core/Text";
// import { With } from "@/components/core/With";
// import { Button } from "@/components/core/Button";
// import { MingcuteRightLine } from "@/components/icons/MingcuteRightLine";

// type AdminButtonProps = {
//   action: string | (() => void);
//   icon: React.ReactElement;
//   label: string;
// };

// export function AdminButton({ action, icon, label }: AdminButtonProps) {
//   return (
//     <Button
//       {...(typeof action === "string" ? { href: action } : { onClick: action })}
//     >
//       <Row
//         align="center"
//         className="group-hover:bg-soft-hover group-active:bg-soft-active gap-4 rounded p-2"
//       >
//         {icon}
//         <Text style="subtitle">{label}</Text>
//         <With flexGrow="1" className="justify-end">
//           <MingcuteRightLine className="size-6" />
//         </With>
//       </Row>
//     </Button>
//   );
// }
