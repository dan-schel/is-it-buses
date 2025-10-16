import React from "react";
import { Renderer } from "@/frontend/components/map/renderer/renderer";
import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { LinesColoringStrategy } from "@/frontend/components/map/renderer/coloring-strategy/lines-coloring-strategy";
import { DisruptionsColoringStrategy } from "@/frontend/components/map/renderer/coloring-strategy/disruptions-coloring-strategy";
import { z } from "zod";

type MapMode = "show-disruptions" | "show-lines-running";

type MapProps = {
  geometry: z.input<typeof Geometry.json>;
  highlighting?: SerializedMapHighlighting;
  mode?: MapMode;
};

export function Map(props: MapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const geometry = React.useMemo(
    () => Geometry.json.parse(props.geometry),
    [props.geometry],
  );

  React.useEffect(() => {
    if (containerRef.current == null || canvasRef.current == null) {
      return;
    }

    const highlighting = props.highlighting ?? { segments: [], points: [] };

    const defaultMode =
      props.highlighting != null ? "show-disruptions" : "show-lines-running";

    const strategy = {
      "show-disruptions": new DisruptionsColoringStrategy(
        geometry,
        highlighting,
      ),
      "show-lines-running": new LinesColoringStrategy(geometry, highlighting),
    }[props.mode ?? defaultMode];

    const renderer = new Renderer(
      containerRef.current,
      canvasRef.current,
      geometry,
      highlighting,
      strategy,
    );
    renderer.start();

    return () => {
      if (renderer != null) {
        renderer.destroy();
      }
    };
  }, [geometry, props.highlighting, props.mode]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ aspectRatio: geometry.suggestedAspectRatio().toFixed(2) }}
    >
      <canvas className="absolute top-0 left-0" ref={canvasRef} />
    </div>
  );
}
