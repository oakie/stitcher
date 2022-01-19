import React from 'react';
import { Popover } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import { useBrushActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import Icon from '../shared/icon';
import StringUtils from '../utils/string-utils';
import BrushSymbol from './brush-symbol';
import ColorPicker from './color-picker';
import SymbolPicker from './symbol-picker';

const PaletteBrushButton = React.memo(({ brush, ...props }) => {
  const handleClick = React.useCallback((e) => {
    e.target.blur();
  }, []);

  return (
    <ToggleButton
      variant="outline-secondary"
      type="checkbox"
      value={brush.id}
      onClick={handleClick}
      {...props}
    >
      <span style={{ color: brush.color }}>
        <BrushSymbol symbol={brush.symbol} />
      </span>
    </ToggleButton>
  );
});

const PopoverButton = ({ header, content, children }) => {
  const handleClick = React.useCallback((e) => e.target.blur(), []);

  return (
    <OverlayTrigger
      trigger="click"
      placement="auto"
      rootClose
      overlay={
        <Popover>
          <Popover.Title>
            <strong>{header}</strong>
          </Popover.Title>
          <Popover.Content>{content}</Popover.Content>
        </Popover>
      }
    >
      <Button variant="outline-secondary" size="sm" onClick={handleClick}>
        <>{children}</>
      </Button>
    </OverlayTrigger>
  );
};

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
    selected: state.brushes.selectedId
  };
};

const Palette = () => {
  const state = useSelector(selector);
  const brushActions = useBrushActions();
  const brushList = Object.values(state.brushes);

  const handleSelectEraser = React.useCallback((e) => {
    e.target.blur();
    brushActions.select();
  });

  const handleSelectBrush = React.useCallback(
    (e) => {
      if (state.selected === e.target.value) {
        brushActions.select();
      } else {
        brushActions.select(e.target.value);
      }
    },
    [state.selected, brushActions]
  );

  const handleCreateBrush = React.useCallback(
    (e) => {
      e.target.blur();
      const brush = {
        id: StringUtils.random(5),
        symbol: Symbols.CROSS,
        color: '#000'
      };
      brushActions.create(brush);
    },
    [brushActions]
  );

  return (
    <>
      <Card bg="dark">
        <Card.Body className="p-1">
          <CurrentBrush brush={state.brushes[state.selected]} />
          <ButtonGroup toggle size="sm">
            <ToggleButton
              variant="outline-secondary"
              type="checkbox"
              checked={!state.selected}
              onClick={handleSelectEraser}
            >
              <Icon icon="eraser" />
            </ToggleButton>
            {brushList.map((l) => (
              <PaletteBrushButton
                key={l.id}
                brush={l}
                checked={state.selected === l.id}
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
