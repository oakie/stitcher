import { Point, Size, Stitch } from '@shared/types';
import { useBrushState, useStitchActions } from '@store';
import CellUtils from '@utils/cell-utils';
import Konva from 'konva';
import React from 'react';
import { DRAFT_LAYER } from './constants';
import { clearDraftLayer, drawSquare, getCenter, getDistance, getWorldPosition, screenToWorld } from './utils';

const SCALE_FACTOR = 1.1;
const MIN_SCALE = 5;
const MAX_SCALE = 100;

interface PointerState {
  down: Point | null;
  prev: Point | null;
}

interface MultiTouchState {
  center: Point;
  distance: number;
}

export const useCanvasControls = (size: Size) => {
  const stitchActions = useStitchActions();
  const { selected: brush } = useBrushState();
  const [scale, setScale] = React.useState<Point>({ x: 10, y: 10 });
  const [center, setCenter] = React.useState<Point>({ x: 0, y: 0 });
  const pointerRef = React.useRef<PointerState>({
    down: null,
    prev: null,
  });
  const multitouchRef = React.useRef<MultiTouchState | null>(null);
  const draftRef = React.useRef<Point[]>([]);

  const handleWheel = React.useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const oldScale = stage.scaleX();

      let factor = Math.sign(e.evt.deltaY) < 0 ? oldScale * SCALE_FACTOR : oldScale / SCALE_FACTOR;
      factor = Math.max(MIN_SCALE, Math.min(MAX_SCALE, factor));

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const zoomCenter = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale,
      };

      const newScale = { x: factor, y: factor };
      const newCenter = {
        x: (pointer.x / factor - zoomCenter.x) * factor,
        y: (pointer.y / factor - zoomCenter.y) * factor,
      };

      setScale(newScale);
      setCenter(screenToWorld(newCenter, size, newScale));
    },
    [size]
  );

  const handleTouchZoomOrPan = React.useCallback((stage: Konva.Stage, p1: Point, p2: Point) => {
    const currCenter = getCenter(p1, p2);
    const currDistance = getDistance(p1, p2);

    const prevCenter = multitouchRef.current ? multitouchRef.current.center : currCenter;
    const prevDistance = multitouchRef.current ? multitouchRef.current.distance : currDistance;

    const oldScale = stage.scaleX();
    const factor = currDistance / prevDistance;
    const newScale = Math.min(Math.max(MIN_SCALE, oldScale * factor), MAX_SCALE);

    const delta = { x: currCenter.x - prevCenter.x, y: currCenter.y - prevCenter.y };

    const zoomCenter = {
      x: (currCenter.x - stage.x()) / oldScale,
      y: (currCenter.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: currCenter.x - zoomCenter.x * newScale + delta.x,
      y: currCenter.y - zoomCenter.y * newScale + delta.y,
    });
    stage.batchDraw();

    multitouchRef.current = { center: currCenter, distance: currDistance };
  }, []);

  const handlePointerDown = React.useCallback((pos: Point) => {
    const cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

    pointerRef.current = {
      down: pos,
      prev: cell,
    };
    draftRef.current = [cell];
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

      const container = stage.container().getBoundingClientRect();
      if (e.evt.touches.length === 1) {
        const touch1 = e.evt.touches[0];
        const screenpos = { x: touch1.clientX - container.left, y: touch1.clientY - container.top };

        const pos = getWorldPosition(stage, screenpos);
        handlePointerDown(pos);
      } else {
        pointerRef.current.down = null;
        pointerRef.current.prev = null;
        clearDraftLayer(stage);
        draftRef.current = [];
      }
    },
    [handlePointerDown]
  );

  const handlePointerUp = React.useCallback(
    (stage: Konva.Stage) => {
      pointerRef.current.down = null;
      pointerRef.current.prev = null;

      if (brush) {
        const stitches: Stitch[] = [];
        for (const c of draftRef.current) {
          stitches.push({
            x: c.x,
            y: c.y,
            id: `${c.x}:${c.y}`,
            brush: brush.id,
          });
        }
        stitchActions.update(stitches);
      } else {
        const ids: string[] = [];
        for (const c of draftRef.current) {
          ids.push(`${c.x}:${c.y}`);
        }
        stitchActions.remove(ids);
      }

      clearDraftLayer(stage);
      draftRef.current = [];
    },
    [stitchActions, brush]
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

      if (pointerRef.current) {
        handlePointerUp(stage);
      }
      multitouchRef.current = null;

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
      if (!pointerRef.current || !pointerRef.current.prev) {
        return;
      }

      const prev = pointerRef.current.prev;
      const curr = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

      if (curr.x !== prev.x || curr.y !== prev.y) {
        const layer = stage.find('.' + DRAFT_LAYER)[0] as Konva.Layer;
        const cells = CellUtils.getCellsOnLine(prev, curr);
        const color = brush ? brush.color : '#fff';

        for (const c of cells) {
          draftRef.current.push(c);
          drawSquare(layer, c.x, c.y, color);
        }
      }

      pointerRef.current.prev = curr;
    },
    [brush]
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

      const container = stage.container().getBoundingClientRect();
      if (e.evt.touches.length === 1) {
        const touch1 = e.evt.touches[0];
        const screenpos = { x: touch1.clientX - container.left, y: touch1.clientY - container.top };
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
        const p1 = { x: touch1.clientX - container.left, y: touch1.clientY - container.top };
        const p2 = { x: touch2.clientX - container.left, y: touch2.clientY - container.top };
        handleTouchZoomOrPan(stage, p1, p2);
        draftRef.current = [];
      }
    },
    [handlePointerMove, handleTouchZoomOrPan]
  );

  const handleDragStart = React.useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.evt) {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      clearDraftLayer(stage);
      draftRef.current = [];
    }
  }, []);

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

  const handleContextMenu = React.useCallback((e: Konva.KonvaEventObject<PointerEvent>) => {
    if (e.evt) {
      e.evt.preventDefault();
    }
  }, []);

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

  const controls = React.useMemo(() => ({ scale, center, handlers }), [scale, center, handlers]);

  return controls;
};
