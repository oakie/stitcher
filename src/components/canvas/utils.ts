import { Point, Size } from '@shared/types';
import Konva from 'konva';
import { DRAFT_LAYER } from './constants';

export const screenToWorld = (pos: Point, size: Size, scale: Point) => {
  return {
    x: (0.5 * size.width - pos.x) / scale.x,
    y: (0.5 * size.height - pos.y) / scale.y,
  };
};
export const getWorldPosition = (
  stage: Konva.Stage,
  screenpos: Point | null = null
) => {
  if (!screenpos) {
    screenpos = stage.getPointerPosition();
  }

  const layer = stage.getLayers()[0];
  const transform = layer.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(screenpos!);
};
export const drawSquare = (
  layer: Konva.Layer,
  x: number,
  y: number,
  color: string
) => {
  const square = new Konva.Rect({
    x,
    y,
    width: 1,
    height: 1,
    fill: color,
  });
  layer.add(square);
  square.draw();
  return square;
};
export const clearDraftLayer = (stage: Konva.Stage) => {
  const layer = stage.find('.' + DRAFT_LAYER)[0] as Konva.Layer;
  layer.removeChildren();
  layer.draw();
};
export const getDistance = (p1: Point, p2: Point) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};
export const getCenter = (p1: Point, p2: Point) => {
  return {
    x: 0.5 * (p1.x + p2.x),
    y: 0.5 * (p1.y + p2.y),
  };
};
