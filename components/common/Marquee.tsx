import React from "react";

type MarqueeProps = {
  children: React.ReactNode;
};

export function Marquee(props: MarqueeProps) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const outerDiv = outerRef.current;
    const innerDiv = innerRef.current;
    if (outerDiv == null || innerDiv == null) return;

    const observer = new ResizeObserver(() => setupMarquee(outerDiv, innerDiv));
    observer.observe(outerDiv);
    observer.observe(innerDiv);
    setupMarquee(outerDiv, innerDiv);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="_marquee" ref={outerRef}>
      <div ref={innerRef}>{props.children}</div>
    </div>
  );
}

function setupMarquee(outerDiv: HTMLDivElement, innerDiv: HTMLDivElement) {
  outerDiv.classList.toggle(
    "active",
    innerDiv.clientWidth > outerDiv.clientWidth,
  );
  const duration = (innerDiv.clientWidth + outerDiv.clientWidth) * 0.03;
  outerDiv.style.setProperty("--duration", `${duration}s`);
  outerDiv.style.setProperty("--width", `${outerDiv.clientWidth}px`);
}
