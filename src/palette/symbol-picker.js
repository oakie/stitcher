import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useBrushActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import BrushSymbol from './brush-symbol';

const SymbolPicker = React.memo(({ brush }) => {
  const brushActions = useBrushActions();
  const symbols = Object.values(Symbols);

  const handlePickSymbol = React.useCallback(
    (_, e) => {
      const payload = { ...brush, symbol: e.target.value };
      brushActions.update(payload);
    },
    [brush, brushActions]
  );

  return (
    <ToggleButtonGroup
      name="symbol-picker-btn-group"
      size="sm"
      type="radio"
      value={brush.symbol}
      onChange={handlePickSymbol}
    >
      {symbols.map((s) => (
        <ToggleButton
          key={s}
          variant="outline-dark"
          type="radio"
          id={`symbol-picker-${s}`}
          value={s}
        >
          <BrushSymbol symbol={s} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
});

export default SymbolPicker;
