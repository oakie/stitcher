import React, { FC } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Brush, Symbol } from '../shared/types';
import { useBrushActions } from '../store';
import BrushSymbol from './brush-symbol';

interface SymbolPickerProps {
  brush: Brush;
}

const SymbolPicker: FC<SymbolPickerProps> = React.memo(({ brush }) => {
  const brushActions = useBrushActions();
  const symbols = Object.values(Symbol);

  const handlePickSymbol = React.useCallback(
    (_: any, e: any) => {
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
