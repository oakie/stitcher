import { colors } from '@shared/constants';
import { Brush } from '@shared/types';
import { useBrushActions } from '@store';
import ColorUtils from '@utils/color-utils';
import React, { FC } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
`;

const SelectedColor = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background-color: ${(p) => p.color};
  border-radius: 4px;
  color: ${(p) => (ColorUtils.isDarkColor(p.color) ? 'white' : 'black')};
  font-size: x-large;
`;

const ColorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorItem = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  background-color: ${(p) => p.color};
  border-radius: 4px;
  cursor: pointer;
`;

interface ColorPickerProps {
  brush: Brush;
}

const ColorPicker: FC<ColorPickerProps> = React.memo(({ brush }) => {
  const brushActions = useBrushActions();

  const handlePickColor = React.useCallback(
    (color: string) => {
      const payload = { ...brush, color };
      brushActions.update(payload);
    },
    [brushActions, brush]
  );

  return (
    <Container>
      <SelectedColor color={brush.color}>
        <strong>{brush.color}</strong>
      </SelectedColor>
      <ColorList>
        {colors.map((x) => (
          <ColorItem key={x} color={x} onClick={() => handlePickColor(x)} />
        ))}
      </ColorList>
    </Container>
  );
});

export default ColorPicker;
