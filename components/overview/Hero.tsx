import React from "react";
import { Text } from "@/components/core/Text";
import { Favicon } from "@/components/icons/Favicon";
import { With } from "@/components/core/With";
import clsx from "clsx";

type HeroProps = {
  className?: string;
};

export function Hero(props: HeroProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 md:flex-row",
        props.className,
      )}
    >
      <With className="text-5xl">
        <Favicon />
      </With>
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Text style="megatitle" align="center">
          Is it buses?
        </Text>
        <Text align="center">
          Melbourne&apos;s train disruptions, visualised
        </Text>
      </div>
    </div>
  );
}
