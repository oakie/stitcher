import React from 'react';
import { ChromePicker } from 'react-color';
import { useLayerActions } from '../redux/actions';
import './color-picker.scss';

const ColorPicker = React.memo(({ layer }) => {
  const layerActions = useLayerActions();

  const handlePickColor = React.useCallback(
    (color) => {
      const payload = { ...layer, color: color.hex };
      layerActions.update(payload);
    },
    [layerActions, layer]
  );

  return (
    <ChromePicker
      className="color-picker"
      disableAlpha
      color={layer.color}
      onChangeComplete={handlePickColor}
    />
  );
});

export default ColorPicker;
