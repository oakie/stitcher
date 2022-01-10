import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useLayerActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import LayerSymbol from './layer-symbol';

const SymbolPicker = React.memo(({ layer }) => {
  const layerActions = useLayerActions();
  const symbols = Object.values(Symbols);

  const handleClick = React.useCallback((e) => e.target.blur(), []);

  const handlePickSymbol = React.useCallback(
    (e) => {
      const payload = { ...layer, symbol: e.target.value };
      layerActions.update(payload);
    },
    [layer, layerActions]
  );

  return (
    <ButtonGroup toggle size="sm">
      {symbols.map((s) => (
        <ToggleButton
          key={s}
          variant="outline-dark"
          type="checkbox"
          value={s}
          checked={layer.symbol === s}
          onClick={handleClick}
          onChange={handlePickSymbol}
        >
          <LayerSymbol symbol={s} />
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
});

export default SymbolPicker;
