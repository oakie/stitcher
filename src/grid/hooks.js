import React from 'react';

const lerp = (vmin, vmax, step) => {
  const first = Math.floor(vmin / step) * step;
  const last = Math.floor(vmax / step) * step;
  const tmp = [];
  for (var v = first; v <= last; v += step) {
    tmp.push(v);
  }
  return tmp;
};

export const useStageGrid = (scale, size, center) => {
  const [grid, setGrid] = React.useState({ x: [], y: [] });

  React.useEffect(() => {
    const xmin = center.x - (0.5 * size.width) / scale.x;
    const xmax = center.x + (0.5 * size.width) / scale.x;
    const ymin = center.y - (0.5 * size.height) / scale.y;
    const ymax = center.y + (0.5 * size.height) / scale.y;

    const step = 1;

    setGrid({ x: lerp(xmin, xmax, step), y: lerp(ymin, ymax, step) });
  }, [scale, size, center]);

  return grid;
};
