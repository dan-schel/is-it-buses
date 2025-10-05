import React from "react";

export function Favicon(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
) {
  return <img src="./favicon.svg" className="h-[1em] w-[1em]" {...props}></img>;
}
