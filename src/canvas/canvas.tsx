import React, { FC, RefCallback } from 'react';
import { Layer, Stage } from 'react-konva';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';
import Cell from '../cell';
import StageGrid from '../grid';
import { Brush, Size, Stitch } from '../shared/types';
import { RootState } from '../store';
import { useCanvasControls } from './canvas-controls';
import { DRAFT_LAYER } from './constants';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const selector = (state: RootState) => {
  return {
    stitches: Object.values(state.stitches.byId),
    brushes: state.brushes.byId,
  };
};

const renderCells = (stitches: Stitch[], brushes: { [key: string]: Brush }) => {
  const result: React.ReactElement[] = [];
  for (let stitch of stitches) {
    const brush = brushes[stitch.brush];
    result.push(
      <Cell
        key={stitch.id}
        x={stitch.x}
        y={stitch.y}
        symbol={brush.symbol}
        color={brush.color}
      />
    );
  }
  return result;
};

interface CanvasProps {
  container: RefCallback<Element>;
  size: Size;
}

export const Canvas: FC<CanvasProps> = ({ container, size }) => {
  const { scale, center, handlers } = useCanvasControls(size);
  const state = useSelector(selector);
  const cells = React.useMemo(
    () => renderCells(state.stitches, state.brushes),
    [state.stitches, state.brushes]
  );

  return (
    <CanvasContainer ref={container}>
      <Stage
        {...size}
        scale={scale}
        x={0.5 * size.width - center.x * scale.x}
        y={0.5 * size.height - center.y * scale.y}
        {...handlers}
      >
        <Layer listening={false}>{cells}</Layer>
        <Layer listening={false} name={DRAFT_LAYER} />
        <Layer listening={false}>
          <StageGrid scale={scale} size={size} center={center} />
        </Layer>
      </Stage>
    </CanvasContainer>
  );
};

export default Canvas;
