import Cell from '@components/cell';
import Grid from '@components/grid';
import { Brush, Size, Stitch } from '@shared/types';
import { useBrushState, useStitchState } from '@store';
import React, { FC, RefCallback } from 'react';
import { Layer, Stage } from 'react-konva';
import { styled } from 'styled-components';
import { DRAFT_LAYER } from './constants';
import { useCanvasControls } from './hooks';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const renderCells = (stitches: { [key: string]: Stitch }, brushes: { [key: string]: Brush }) => {
  const result: React.ReactElement[] = [];
  for (const stitch of Object.values(stitches)) {
    const brush = brushes[stitch.brush];
    if (brush) {
      result.push(<Cell key={stitch.id} x={stitch.x} y={stitch.y} shape={brush.shape} color={brush.color} />);
    }
  }
  return result;
};

interface CanvasProps {
  container: RefCallback<Element>;
  size: Size;
}

const Canvas: FC<CanvasProps> = ({ container, size }) => {
  const { scale, center, handlers } = useCanvasControls(size);
  const brushes = useBrushState();
  const stitches = useStitchState();
  const cells = React.useMemo(() => renderCells(stitches.byId, brushes.byId), [stitches.byId, brushes]);

  return (
    <CanvasContainer ref={container} className="bg-light">
      <Stage {...size} scale={scale} x={0.5 * size.width - center.x * scale.x} y={0.5 * size.height - center.y * scale.y} {...handlers}>
        <Layer listening={false}>{cells}</Layer>
        <Layer listening={false} name={DRAFT_LAYER} />
        <Layer listening={false}>
          <Grid scale={scale} size={size} center={center} />
        </Layer>
      </Stage>
    </CanvasContainer>
  );
};

export default Canvas;
