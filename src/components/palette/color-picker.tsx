import { colors } from '@shared/constants';
import { Brush } from '@shared/types';
import { useBrushActions } from '@store';
import React, { FC } from 'react';
import { BlockPicker, ColorResult } from 'react-color';
import { styled } from 'styled-components';

const StyledColorPicker = styled(BlockPicker)`
  border-radius: 0 !important;
  background-color: transparent !important;
  box-shadow: initial !important;
  font-family: inherit !important;
  font-weight: bold;

  > div:last-child {
    padding: 0 !important;
    padding-top: 10px !important;

    > div:first-child {
      display: flex !important;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0 !important;
      margin-bottom: -10px !important;

      > span > div {
        margin: 0 !important;
      }
    }

    > div:last-child {
      display: none !important;
    }
  }
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

  return <StyledColorPicker colors={colors} triangle="hide" width="120px" color={brush.color} onChangeComplete={handlePickColor} />;
});

export default ColorPicker;
