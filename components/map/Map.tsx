import React from "react";
import { Renderer } from "@/components/map/renderer/renderer";
import { Geometry } from "@/components/map/renderer/geometry";

// To debug geometry without needing to re-run the generator:
// import geometry from "@/scripts/generate-map-geometry/ptv";
import geometryJson from "@/components/map/geometry/ptv.json";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { LinesColoringStrategy } from "@/components/map/renderer/coloring-strategy/lines-coloring-strategy";
import { DisruptionsColoringStrategy } from "@/components/map/renderer/coloring-strategy/disruptions-coloring-strategy";

type MapMode = "show-disruptions" | "show-lines-running";

type MapProps = {
  highlighting?: SerializedMapHighlighting;
  mode?: MapMode;
};

export function Map(props: MapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const geometry = React.useMemo(() => Geometry.json.parse(geometryJson), []);

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
