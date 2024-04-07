import React from 'react';
import { ChromePicker } from 'react-color';
import { useBrushActions } from '../redux/actions';
import { styled } from 'styled-components';

const StyledColorPicker = styled(ChromePicker)`
  box-shadow: initial !important;
  font-family: inherit !important;
  font-weight: bold;
`;

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
    <StyledColorPicker
      disableAlpha
      color={brush.color}
      onChangeComplete={handlePickColor}
    />
  );
});

export default ColorPicker;
