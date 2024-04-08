import React from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useSelector } from 'react-redux';
import { useBrushActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import Icon from '../shared/icon';
import StringUtils from '../utils/string-utils';
import BrushSymbol from './brush-symbol';
import ColorPicker from './color-picker';
import SymbolPicker from './symbol-picker';

const PaletteBrushButton = React.memo(({ brush, ...props }) => {
  if (!brush) {
    return (
      <ToggleButton
        variant="outline-secondary"
        type="radio"
        name="palette-brush"
        id={`palette-brush-eraser`}
        value="eraser"
        {...props}
      >
        <Icon icon="eraser" />
      </ToggleButton>
    );
  }

  return (
    <ToggleButton
      variant="outline-secondary"
      type="radio"
      name="palette-brush"
      id={`palette-brush-${brush.id}`}
      value={brush.id}
      {...props}
    >
      <span style={{ color: brush.color }}>
        <BrushSymbol symbol={brush.symbol} />
      </span>
    </ToggleButton>
  );
});

const PopoverButton = React.memo(({ header, content, children }) => {
  return (
    <OverlayTrigger
      trigger="click"
      placement="auto"
      rootClose
      overlay={
        <Popover>
          <Popover.Header>
            <strong>{header}</strong>
          </Popover.Header>
          <Popover.Body>{content}</Popover.Body>
        </Popover>
      }
    >
      <Button variant="outline-secondary" size="sm">
        <>{children}</>
      </Button>
    </OverlayTrigger>
  );
});

const CurrentBrush = React.memo(({ brush }) => {
  if (!brush) {
    return null;
  }

  return (
    <ButtonGroup className="mr-5">
      <PopoverButton
        header="Select brush color"
        content={<ColorPicker brush={brush} />}
      >
        <Icon icon="palette" color={brush.color} />
      </PopoverButton>
      <PopoverButton
        header="Select brush symbol"
        content={<SymbolPicker brush={brush} />}
      >
        <BrushSymbol symbol={brush.symbol} />
      </PopoverButton>
    </ButtonGroup>
  );
});

const selector = (state) => {
  return {
    brushes: state.brushes.byId,
    selected: state.brushes.selectedId,
  };
};

const Palette = () => {
  const state = useSelector(selector);
  const brushActions = useBrushActions();
  const brushList = Object.values(state.brushes);

  const handleSelectBrush = React.useCallback(
    (e) => {
      const value = e.target.value;
      if (value === 'eraser' || value === state.selected) {
        brushActions.select();
      } else {
        brushActions.select(value);
      }
    },
    [state.selected, brushActions]
  );

  const handleCreateBrush = React.useCallback(
    (e) => {
      const brush = {
        id: StringUtils.random(5),
        symbol: Symbols.CROSS,
        color: '#000',
      };
      brushActions.create(brush);
    },
    [brushActions]
  );

  return (
    <>
      <Card bg="dark">
        <Card.Body className="d-flex p-1 gap-2">
          <CurrentBrush brush={state.brushes[state.selected]} />

          <ButtonGroup size="sm">
            <PaletteBrushButton
              brush={null}
              checked={!state.selected}
              onChange={handleSelectBrush}
            />
            {brushList.map((brush) => (
              <PaletteBrushButton
                key={brush.id}
                brush={brush}
                checked={state.selected === brush.id}
                onChange={handleSelectBrush}
              />
            ))}
          </ButtonGroup>

          <Button
            variant="outline-secondary"
            onClick={handleCreateBrush}
            size="sm"
            className="ml-3"
          >
            <Icon icon="plus" />
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default Palette;
