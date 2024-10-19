import { Brush, Shape } from '@shared/types';
import { useBrushActions } from '@store';
import React, { FC } from 'react';
import styled from 'styled-components';
import BrushShape from './brush-shape';

const Container = styled.div`
  width: 120px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ShapeItem = styled.div<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(p) => (p.selected ? '1px solid currentColor' : '0')};
  border-radius: 4px;
  cursor: pointer;
`;

interface ShapePickerProps {
  brush: Brush;
}

const ShapePicker: FC<ShapePickerProps> = React.memo(({ brush }) => {
  const brushActions = useBrushActions();
  const shapes = Object.values(Shape);

  const handlePickShape = React.useCallback(
    (shape: Shape) => {
      const payload = { ...brush, shape };
      brushActions.update(payload);
    },
    [brush, brushActions]
  );

  return (
    <Container>
      {shapes.map((x) => (
        <ShapeItem key={x} selected={brush.shape === x} onClick={() => handlePickShape(x)}>
          <BrushShape shape={x} />
        </ShapeItem>
      ))}
    </Container>
  );
});

export default ShapePicker;
