import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';
import React from 'react';
import { Stitch, Point, Size } from '../shared/types';
import { useStitchActions } from '../store';
import { RootState, useAppSelector } from '../store/store';
import { getCellsOnLine } from '../utils/cell-utils';
import { DRAFT_LAYER } from './constants';

const SCALE_FACTOR = 1.1;
const MIN_SCALE = 5;
const MAX_SCALE = 100;

interface PointerState {
  down: Vector2d | null;
  prev: Vector2d | null;
}

interface MultiTouchState {
  center: Vector2d;
  distance: number;
}

const screenToWorld = (pos: Point, size: Size, scale: Point) => {
  return {
    x: (0.5 * size.width - pos.x) / scale.x,
    y: (0.5 * size.height - pos.y) / scale.y,
  };
};

const getWorldPosition = (
  stage: Konva.Stage,
  screenpos: Konva.Vector2d | null = null
) => {
  if (!screenpos) {
    screenpos = stage.getPointerPosition();
  }

  const layer = stage.getLayers()[0];
  const transform = layer.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(screenpos!);
};

const drawSquare = (
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

const clearDraftLayer = (stage: Konva.Stage) => {
  const layer = stage.find('.' + DRAFT_LAYER)[0] as Konva.Layer;
  layer.removeChildren();
  layer.draw();
};

const getDistance = (p1: Point, p2: Point) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getCenter = (p1: Point, p2: Point) => {
  return {
    x: 0.5 * (p1.x + p2.x),
    y: 0.5 * (p1.y + p2.y),
  };
};

const selector = (state: RootState) => ({
  brush: state.brushes.byId[state.brushes.selectedId || -1],
  stitches: state.stitches.byId,
});

export const useCanvasControls = (size: Size) => {
  const stitchActions = useStitchActions();
  const state = useAppSelector(selector);
  const [scale, setScale] = React.useState<Point>({ x: 10, y: 10 });
  const [center, setCenter] = React.useState<Point>({ x: 0, y: 0 });
  const pointer = React.useRef<PointerState>({
    down: null,
    prev: null,
  });
  const multitouch = React.useRef<MultiTouchState | null>(null);
  const draft = React.useRef<Vector2d[]>([]);

  const handleWheel = React.useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const oldScale = stage.scaleX();

      var factor =
        Math.sign(e.evt.deltaY) < 0
          ? oldScale * SCALE_FACTOR
          : oldScale / SCALE_FACTOR;
      factor = Math.max(MIN_SCALE, Math.min(MAX_SCALE, factor));

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale,
      };

      const newScale = { x: factor, y: factor };
      const newCenter = {
        x: -(mousePointTo.x - pointer.x / factor) * factor,
        y: -(mousePointTo.y - pointer.y / factor) * factor,
      };

      setScale(newScale);
      setCenter(screenToWorld(newCenter, size, newScale));
    },
    [size]
  );

  const handleTouchZoomOrPan = React.useCallback(
    (stage: Konva.Stage, p1: Point, p2: Point) => {
      const currCenter = getCenter(p1, p2);
      const currDistance = getDistance(p1, p2);

      const prevCenter = multitouch.current
        ? multitouch.current.center
        : currCenter;
      const prevDistance = multitouch.current
        ? multitouch.current.distance
        : currDistance;

      const oldScale = stage.scaleX();
      const factor = currDistance / prevDistance;
      const newScale = Math.min(
        Math.max(MIN_SCALE, oldScale * factor),
        MAX_SCALE
      );

      const dx = (currCenter.x - prevCenter.x) / oldScale;
      const dy = (currCenter.y - prevCenter.y) / oldScale;

      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: stage.x() + dx * newScale,
        y: stage.y() + dy * newScale,
      });
      stage.batchDraw();

      // setScale({ x: newScale, y: newScale });
      // setCenter((center) => ({ x: center.x + dx, y: center.y + dy }));

      multitouch.current = { center: currCenter, distance: prevDistance };
    },
    []
  );

  const handlePointerDown = React.useCallback((pos: Point) => {
    const cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

    pointer.current = {
      down: pos,
      prev: cell,
    };
    draft.current = [cell];
  }, []);

  const handleMouseDown = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }
      const stage = e.target.getStage();
      if (!stage) return;
      if (e.evt.button === 0) {
        const pos = getWorldPosition(stage);
        handlePointerDown(pos);
      } else if (e.evt.button === 2) {
        stage.draggable(true);
      }
    },
    [handlePointerDown]
  );

  const handleTouchDown = React.useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (!stage) return;

      if (e.evt.touches.length === 1) {
        const touch1 = e.evt.touches[0];
        const screenpos = { x: touch1.clientX, y: touch1.clientY };
        const pos = getWorldPosition(stage, screenpos);
        handlePointerDown(pos);
      }
    },
    [handlePointerDown]
  );

  const handlePointerUp = React.useCallback(
    (stage: Stage) => {
      pointer.current.down = null;
      pointer.current.prev = null;

      if (state.brush) {
        const stitches: Stitch[] = [];
        for (let c of draft.current) {
          stitches.push({
            x: c.x,
            y: c.y,
            id: `${c.x}:${c.y}`,
            brush: state.brush.id,
          });
        }
        stitchActions.update(stitches);
      } else {
        const ids: string[] = [];
        for (let c of draft.current) {
          ids.push(`${c.x}:${c.y}`);
        }
        stitchActions.remove(ids);
      }

      clearDraftLayer(stage);
      draft.current = [];
    },
    [stitchActions, state.brush]
  );

  const handleMouseUp = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (!stage) return;

      if (e.evt.button === 0) {
        handlePointerUp(stage);
      } else if (e.evt.button === 2) {
        stage.draggable(false);
      }
    },
    [handlePointerUp]
  );

  const handleTouchUp = React.useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (!stage) return;

      if (pointer.current) {
        handlePointerUp(stage);
      }
      multitouch.current = null;

      const scale = stage.scaleX();
      setCenter({
        x: (0.5 * size.width - stage.x()) / scale,
        y: (0.5 * size.height - stage.y()) / scale,
      });
      setScale({ x: scale, y: scale });
    },
    [handlePointerUp, size]
  );

  const handlePointerMove = React.useCallback(
    (stage: Konva.Stage, pos: Point) => {
      if (!pointer.current || !pointer.current.prev) {
        return;
      }

      const prev = pointer.current.prev;
      const curr = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

      if (curr.x !== prev.x || curr.y !== prev.y) {
        const layer = stage.find('.' + DRAFT_LAYER)[0] as Konva.Layer;
        const cells = getCellsOnLine(prev, curr);
        const color = state.brush ? state.brush.color : '#fff';

        for (let c of cells) {
          draft.current.push(c);
          drawSquare(layer, c.x, c.y, color);
        }
      }

      pointer.current.prev = curr;
    },
    [state.brush]
  );

  const handleMouseMove = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getWorldPosition(stage);

      handlePointerMove(stage, pos);
    },
    [handlePointerMove]
  );

  const handleTouchMove = React.useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (!stage) return;

      if (e.evt.touches.length === 1) {
        const touch1 = e.evt.touches[0];
        const screenpos = { x: touch1.clientX, y: touch1.clientY };
        const pos = getWorldPosition(stage, screenpos);

        handlePointerMove(stage, pos);
      } else if (e.evt.touches.length === 2) {
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];
        if (!touch1 || !touch2) {
          return;
        }
        if (stage.isDragging()) {
          stage.stopDrag();
        }
        const p1 = { x: touch1.clientX, y: touch1.clientY };
        const p2 = { x: touch2.clientX, y: touch2.clientY };
        handleTouchZoomOrPan(stage, p1, p2);
        clearDraftLayer(stage);
        draft.current = [];
      }
    },
    [handlePointerMove, handleTouchZoomOrPan]
  );

  const handleDragStart = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();

        const stage = e.target.getStage();
        if (!stage) return;

        clearDraftLayer(stage);
        draft.current = [];
      }
    },
    []
  );

  const handleDragEnd = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }
      const pos = e.currentTarget.position();
      setCenter(screenToWorld(pos, size, scale));
    },
    [size, scale]
  );

  const handleContextMenu = React.useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt) {
        e.evt.preventDefault();
      }
    },
    []
  );

  const handlers = React.useMemo(
    () => ({
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onContextMenu: handleContextMenu,
      onTouchStart: handleTouchDown,
      onTouchEnd: handleTouchUp,
      onTouchMove: handleTouchMove,
    }),
    [
      handleWheel,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      handleDragStart,
      handleDragEnd,
      handleContextMenu,
      handleTouchDown,
      handleTouchUp,
      handleTouchMove,
    ]
  );

  const controls = React.useMemo(
    () => ({ scale, center, handlers }),
    [scale, center, handlers]
  );

  return controls;
};
