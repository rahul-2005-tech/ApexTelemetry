import { lazy, Suspense } from "react";
import Skeleton from "../ui/Skeleton.jsx";
import { baseConfig, baseLayout } from "./plotlyTheme.js";

// Plotly is large, so it is only fetched when a chart is first rendered.
// The "basic" bundle covers bar, scatter and pie traces.
const Plot = lazy(async () => {
  const [{ default: Plotly }, { default: createPlotlyComponent }] = await Promise.all([
    import("plotly.js-basic-dist-min"),
    import("react-plotly.js/factory"),
  ]);
  return { default: createPlotlyComponent(Plotly) };
});

export default function PlotlyChart({ data, layout = {}, height = 320, ariaLabel }) {
  const mergedLayout = {
    ...baseLayout,
    ...layout,
    xaxis: { ...baseLayout.xaxis, ...layout.xaxis },
    yaxis: { ...baseLayout.yaxis, ...layout.yaxis },
    autosize: true,
  };

  return (
    <div role="img" aria-label={ariaLabel} style={{ height }}>
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Plot
          data={data}
          layout={mergedLayout}
          config={baseConfig}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </Suspense>
    </div>
  );
}
