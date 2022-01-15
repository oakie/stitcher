import Konva from 'konva';
import React from 'react';
import { useSelector } from 'react-redux';
import { useCellActions } from '../redux/actions';
import CellUtils from '../utils/cell-utils';
import { DRAFT_LAYER } from './constants';

const SCALE_FACTOR = 1.1;
const MIN_SCALE = 5;
const MAX_SCALE = 100;

const screenToWorld = (pos, size, scale) => {
  return {
    x: (0.5 * size.width - pos.x) / scale.x,
    y: (0.5 * size.height - pos.y) / scale.y
  };
};

const getWorldPosition = (stage, screenpos) => {
  if (!screenpos) {
    screenpos = stage.getPointerPosition();
  }

  const layer = stage.getLayers()[0];
  const transform = layer.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(screenpos);
};

const drawSquare = (layer, x, y, color) => {
  const square = new Konva.Rect({
    x,
    y,
    width: 1,
    height: 1,
    fill: color
  });
  layer.add(square);
  square.draw();
  return square;
};

const clearDraftLayer = (stage) => {
  const layer = stage.find('.' + DRAFT_LAYER);
  layer.removeChildren();
  layer.draw();
};

const getDistance = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getCenter = (p1, p2) => {
  return {
    x: 0.5 * (p1.x + p2.x),
    y: 0.5 * (p1.y + p2.y)
  };
};

const selector = () => {
  return (state) => ({
    brush: state.brushes.byId[state.brushes.selectedId],
    cells: state.cells.byId
  });
};

export const useCanvasControls = (size) => {
  const cellActions = useCellActions();
  const state = useSelector(selector());
  const [scale, setScale] = React.useState({ x: 10, y: 10 });
  const [center, setCenter] = React.useState({ x: 0, y: 0 });
  const pointer = React.useRef({ down: false, prev: false });
  const multitouch = React.useRef(null);
  const draft = React.useRef([]);

  const handleWheel = React.useCallback(
    (e) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      const oldScale = stage.scaleX();

      var factor =
        Math.sign(e.evt.deltaY) < 0
          ? oldScale * SCALE_FACTOR
          : oldScale / SCALE_FACTOR;
      factor = Math.max(MIN_SCALE, Math.min(MAX_SCALE, factor));

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

  const handleTouchZoomOrPan = React.useCallback((stage, p1, p2) => {
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
      y: stage.y() + dy * newScale
    });
    stage.batchDraw();

    // setScale({ x: newScale, y: newScale });
    // setCenter((center) => ({ x: center.x + dx, y: center.y + dy }));

    multitouch.current = { center: currCenter, distance: prevDistance };
  }, []);

  const handlePointerDown = React.useCallback((pos) => {
    const cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

    pointer.current = {
      down: pos,
      prev: cell
    };
    draft.current = [cell];
  }, []);

  const handleMouseDown = React.useCallback(
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }
      const stage = e.target.getStage();
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
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
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
    (stage) => {
      pointer.current.down = false;
      pointer.current.prev = false;

      if (state.brush) {
        const cells = [];
        for (let c of draft.current) {
          cells.push({
            x: c.x,
            y: c.y,
            id: `${c.x}:${c.y}`,
            brushId: state.brush.id
          });
        }
        cellActions.update(cells);
      } else {
        const cells = [];
        for (let c of draft.current) {
          cells.push(`${c.x}:${c.y}`);
        }
        cellActions.remove(cells);
      }

      clearDraftLayer(stage);
      draft.current = [];
    },
    [cellActions, state.brush]
  );

  const handleMouseUp = React.useCallback(
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (e.evt.button === 0) {
        handlePointerUp(stage);
      } else if (e.evt.button === 2) {
        stage.draggable(false);
      }
    },
    [handlePointerUp]
  );

  const handleTouchUp = React.useCallback(
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      if (pointer.current) {
        handlePointerUp(stage);
      }
      multitouch.current = null;

      const scale = stage.scaleX();
      setCenter({
        x: (0.5 * size.width - stage.x()) / scale,
        y: (0.5 * size.height - stage.y()) / scale
      });
      setScale({ x: scale, y: scale });
    },
    [handlePointerUp, size]
  );

  const handlePointerMove = React.useCallback(
    (stage, pos) => {
      if (!pointer.current || !pointer.current.prev) {
        return;
      }

      const prev = pointer.current.prev;
      const curr = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

      if (curr.x !== prev.x || curr.y !== prev.y) {
        const layer = stage.find('.' + DRAFT_LAYER)[0];
        const cells = CellUtils.getCellsOnLine(prev, curr);
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
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();
      const pos = getWorldPosition(stage);

      handlePointerMove(stage, pos);
    },
    [handlePointerMove]
  );

  const handleTouchMove = React.useCallback(
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }

      const stage = e.target.getStage();

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

  const handleDragStart = React.useCallback((e) => {
    if (e.evt) {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      clearDraftLayer(stage);
      draft.current = [];
    }
  }, []);

  const handleDragEnd = React.useCallback(
    (e) => {
      if (e.evt) {
        e.evt.preventDefault();
      }
      const pos = e.currentTarget.position();
      setCenter(screenToWorld(pos, size, scale));
    },
    [size, scale]
  );

  const handleContextMenu = React.useCallback((e) => {
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
      onTouchMove: handleTouchMove
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
      handleTouchMove
    ]
  );

  const controls = React.useMemo(() => [scale, center, handlers], [
    scale,
    center,
    handlers
  ]);

  return controls;
};
