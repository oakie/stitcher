import { Brush, Shape } from '@shared/types';
import { useBrushActions } from '@store';
import React, { FC } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import BrushShape from './brush-shape';

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
    <ToggleButtonGroup name="shape-picker-btn-group" size="sm" type="radio" value={brush.shape} onChange={handlePickShape}>
      {shapes.map((s) => (
        <ToggleButton key={s} variant="outline-secondary" type="radio" id={`shape-picker-${s}`} value={s}>
          <BrushShape shape={s} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
});

export default ShapePicker;
