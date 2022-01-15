import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useBrushActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import BrushSymbol from './brush-symbol';

const SymbolPicker = React.memo(({ brush }) => {
  const brushActions = useBrushActions();
  const symbols = Object.values(Symbols);

  const handleClick = React.useCallback((e) => e.target.blur(), []);

  const handlePickSymbol = React.useCallback(
    (e) => {
      const payload = { ...brush, symbol: e.target.value };
      brushActions.update(payload);
    },
    [brush, brushActions]
  );

  return (
    <ButtonGroup toggle size="sm">
      {symbols.map((s) => (
        <ToggleButton
          key={s}
          variant="outline-dark"
          type="checkbox"
          value={s}
          checked={brush.symbol === s}
          onClick={handleClick}
          onChange={handlePickSymbol}
        >
          <BrushSymbol symbol={s} />
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
});

export default SymbolPicker;
