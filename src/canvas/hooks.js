import React from 'react';
import useCellActions from '../redux/actions';
import CellUtils from '../utils/cell-utils';

const SCALE_FACTOR = 1.1;

const screenToWorld = (pos, size, scale) => {
  return {
    x: (0.5 * size.width - pos.x) / scale.x,
    y: (0.5 * size.height - pos.y) / scale.y
  };
};

const getPointerPosition = (stage) => {
  const screenpos = stage.getPointerPosition();
  const layer = stage.getLayers()[0];
  const transform = layer.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(screenpos);
};

export const useCanvasControls = (size) => {
  const cellActions = useCellActions();
  const [scale, setScale] = React.useState({ x: 10, y: 10 });
  const [center, setCenter] = React.useState({ x: 0, y: 0 });
  const pointer = React.useRef({ down: false, prev: false });

  const handleWheel = React.useCallback(
    (e) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      const oldScale = stage.scaleX();

      var factor =
        Math.sign(e.evt.deltaY) < 0
          ? oldScale * SCALE_FACTOR
          : oldScale / SCALE_FACTOR;
      factor = Math.max(1, Math.min(1500, factor));

      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      const newScale = { x: factor, y: factor };
      const newCenter = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / factor) * factor,
        y: -(mousePointTo.y - stage.getPointerPosition().y / factor) * factor
      };

      setScale(newScale);
      setCenter(screenToWorld(newCenter, size, newScale));
    },
    [size]
  );

  const handleMouseDown = React.useCallback(
    (e) => {
      const stage = e.target.getStage();
      if (e.evt.button === 0) {
        const pos = getPointerPosition(stage);
        const cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

        console.log(pos, cell);

        pointer.current = {
          down: pos,
          prev: cell
        };
        cellActions.create({
          id: new Date().toISOString(),
          ...cell
        });
      } else if (e.evt.button === 2) {
        stage.draggable(true);
      }
    },
    [cellActions]
  );

  const handleMouseUp = React.useCallback((e) => {
    if (e.evt.button === 0) {
      pointer.current.down = false;
      pointer.current.prev = false;
    } else if (e.evt.button === 2) {
      const stage = e.target.getStage();
      stage.draggable(false);
    }
  }, []);

  const handleMouseMove = React.useCallback(
    (e) => {
      if (!pointer.current || !pointer.current.prev) {
        return;
      }

      const prev = pointer.current.prev;
      const stage = e.target.getStage();
      const pos = getPointerPosition(stage);
      const curr = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
      if (curr.x !== prev.x || curr.y !== prev.y) {
        const cells = CellUtils.getCellsOnLine(prev, curr);

        for (let c of cells) {
          const id = `${c.x}:${c.y}`;
          cellActions.update({ id, ...c });
        }
      }

      pointer.current.prev = curr;
    },
    [cellActions]
  );

  const handleDragStart = React.useCallback((e) => {
    e.evt.preventDefault();
  }, []);

  const handleDragEnd = React.useCallback(
    (e) => {
      e.evt.preventDefault();
      const pos = e.currentTarget.position();
      setCenter(screenToWorld(pos, size, scale));
    },
    [size, scale]
  );

  const handleContextMenu = React.useCallback((e) => {
    e.evt.preventDefault();
  }, []);

  const handlers = React.useMemo(
    () => ({
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onContextMenu: handleContextMenu
    }),
    [
      handleWheel,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      handleDragStart,
      handleDragEnd,
      handleContextMenu
    ]
  );

  const controls = React.useMemo(() => [scale, center, handlers], [
    scale,
    center,
    handlers
  ]);

  return controls;
};
