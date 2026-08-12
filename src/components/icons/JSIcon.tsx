import type { SVGProps } from "react";

/**
 * JavaScript "JS" mark, drawn as bold glyphs.
 * Inherits currentColor so it can sit on the gradient brand tile.
 */
export default function JSIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill="currentColor"
        fontFamily="ui-monospace, Consolas, monospace"
      >
        JS
      </text>
    </svg>
  );
}
