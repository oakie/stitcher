import { Point } from '@shared/types';

const getCellsOnLine = (p1: Point, p2: Point) => {
  const result: Point[] = [];

  let x0 = p1.x;
  let y0 = p1.y;
  const x1 = p2.x;
  const y1 = p2.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  let err = dx - dy;
  while (true) { // eslint-disable-line no-constant-condition
    result.push({ x: x0, y: y0 });

    if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return result;
};

const CellUtils = { getCellsOnLine };
export default CellUtils;
