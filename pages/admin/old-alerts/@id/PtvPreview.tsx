import React from "react";

export type PtvPreviewProps = {
  html: string;
};

export function PtvPreview(props: PtvPreviewProps) {
  return (
    <div
      className="_ptv-preview"
      // The HTML is sanitized on the server.
      dangerouslySetInnerHTML={{
        __html: props.html,
      }}
    />
  );
}
