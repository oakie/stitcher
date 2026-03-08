import { Point, Size } from '@shared/types';
import MathUtils from '@utils/math-utils';
import React from 'react';

interface GridBreakpoints {
  x: number[];
  y: number[];
}

export const useGridBreakpoints = (scale: Point, size: Size, center: Point) => {
  return React.useMemo<GridBreakpoints>(() => {
    const xmin = center.x - (0.5 * size.width) / scale.x;
    const xmax = center.x + (0.5 * size.width) / scale.x;
    const ymin = center.y - (0.5 * size.height) / scale.y;
    const ymax = center.y + (0.5 * size.height) / scale.y;

    return {
      x: MathUtils.lerp(xmin, xmax, 1),
      y: MathUtils.lerp(ymin, ymax, 1),
    };
  }, [scale, size, center]);
};
