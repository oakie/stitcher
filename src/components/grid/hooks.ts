import { Point, Size } from '@shared/types';
import MathUtils from '@utils/math-utils';
import React from 'react';

interface GridBreakpoints {
  x: number[];
  y: number[];
}

export const useGridBreakpoints = (scale: Point, size: Size, center: Point) => {
  const [grid, setGrid] = React.useState<GridBreakpoints>({ x: [], y: [] });

  React.useEffect(() => {
    const xmin = center.x - (0.5 * size.width) / scale.x;
    const xmax = center.x + (0.5 * size.width) / scale.x;
    const ymin = center.y - (0.5 * size.height) / scale.y;
    const ymax = center.y + (0.5 * size.height) / scale.y;

    const step = 1;

    setGrid({
      x: MathUtils.lerp(xmin, xmax, step),
      y: MathUtils.lerp(ymin, ymax, step),
    });
  }, [scale, size, center]);

  return grid;
};
