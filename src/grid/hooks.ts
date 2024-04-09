import React from 'react';
import { Point, Size } from '../shared/types';
import { GridBreakpoints } from './types';

const lerp = (vmin: number, vmax: number, step: number) => {
  const first = Math.floor(vmin / step) * step;
  const last = Math.floor(vmax / step) * step;
  const tmp: number[] = [];
  for (var v = first; v <= last; v += step) {
    tmp.push(v);
  }
  return tmp;
};

export const useGridBreakpoints = (scale: Point, size: Size, center: Point) => {
  const [grid, setGrid] = React.useState<GridBreakpoints>({ x: [], y: [] });

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
