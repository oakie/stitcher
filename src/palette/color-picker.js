import React from 'react';
import { ChromePicker } from 'react-color';
import { useBrushActions } from '../redux/actions';
import './color-picker.scss';

const ColorPicker = React.memo(({ brush }) => {
  const brushActions = useBrushActions();

  const handlePickColor = React.useCallback(
    (color) => {
      const payload = { ...brush, color: color.hex };
      brushActions.update(payload);
    },
    [brushActions, brush]
  );

  return (
    <ChromePicker
      className="color-picker"
      disableAlpha
      color={brush.color}
      onChangeComplete={handlePickColor}
    />
  );
});

export default ColorPicker;
