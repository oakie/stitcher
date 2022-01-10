import React from 'react';
import { Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Cell from '../cell';
import StageGrid from '../grid';
import { useCanvasControls } from './canvas-controls';
import './canvas.scss';
import { DRAFT_LAYER } from './constants';
import StageWithContext from './stage-with-context';

const selector = (state) => {
  return {
    cells: Object.values(state.cells.byId),
    layers: state.layers.byId
  };
};

const renderCells = (cells, layers) => {
  const result = [];
  for (let cell of cells) {
    const layer = layers[cell.layerId];
    result.push(
      <Cell
        key={cell.id}
        x={cell.x}
        y={cell.y}
        symbol={layer.symbol}
        color={layer.color}
      />
    );
  }
  return result;
};

export const Canvas = ({ container, size }) => {
  const [scale, center, handlers] = useCanvasControls(size);
  const state = useSelector(selector);
  const cells = React.useMemo(() => renderCells(state.cells, state.layers), [
    state.cells,
    state.layers
  ]);

  return (
    <div className="canvas" ref={container}>
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
        <Layer listening={false}>{cells}</Layer>
        <Layer listening={false} name={DRAFT_LAYER} />
      </StageWithContext>
    </div>
  );
};

export default Canvas;
