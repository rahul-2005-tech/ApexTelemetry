// Shared dark theme so every chart matches the dashboard.
export const baseLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: {
    family: 'ui-monospace, "Cascadia Mono", Consolas, monospace',
    size: 11,
    color: "#a1a1ab",
  },
  margin: { t: 16, r: 12, b: 40, l: 44 },
  xaxis: {
    gridcolor: "#26262e",
    linecolor: "#34343f",
    zerolinecolor: "#34343f",
    fixedrange: true,
  },
  yaxis: {
    gridcolor: "#26262e",
    linecolor: "#34343f",
    zerolinecolor: "#52525b",
    fixedrange: true,
  },
  hoverlabel: {
    bgcolor: "#17171d",
    bordercolor: "#34343f",
    font: { color: "#f4f4f5" },
  },
};

export const baseConfig = {
  displaylogo: false,
  displayModeBar: false,
  responsive: true,
};
