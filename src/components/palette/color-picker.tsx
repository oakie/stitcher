import React, { FC } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { styled } from 'styled-components';
import { Brush } from '@shared/types';
import { useBrushActions } from '@store';

const StyledColorPicker = styled(ChromePicker)`
  box-shadow: initial !important;
  font-family: inherit !important;
  font-weight: bold;
`;

interface ColorPickerProps {
  brush: Brush;
}

const ColorPicker: FC<ColorPickerProps> = React.memo(({ brush }) => {
  const brushActions = useBrushActions();

  const handlePickColor = React.useCallback(
    (color: ColorResult) => {
      const payload = { ...brush, color: color.hex };
      brushActions.update(payload);
    },
    [brushActions, brush]
  );

  return (
    <StyledColorPicker
      disableAlpha
      color={brush.color}
      onChangeComplete={handlePickColor}
    />
  );
});

export default ColorPicker;
