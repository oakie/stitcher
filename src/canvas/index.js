import Konva from 'konva';
import React from 'react';
import { Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Cell from '../cell';
import StageGrid from '../grid';
import { useCanvasControls } from './hooks';
import StageWithContext from './stage-with-context';

Konva.dragButtons = [0, 2];

const selector = (state) => {
  return { cells: Object.values(state.cells.byId) };
};

export const Canvas = ({ size }) => {
  const state = useSelector(selector);
  const [scale, center, handlers] = useCanvasControls(size);

  return (
    <>
      <StageWithContext
        {...size}
        scale={scale}
        x={0.5 * size.width - center.x * scale.x}
        y={0.5 * size.height - center.y * scale.y}
        {...handlers}
      >
        <Layer listening={false}>
          <StageGrid scale={scale} size={size} center={center} />
        </Layer>
        <Layer listening={false}>
          {state.cells.map((c, i) => (
            <Cell key={c.id} id={c.id} />
          ))}
        </Layer>
      </StageWithContext>
    </>
  );
};

export default Canvas;
