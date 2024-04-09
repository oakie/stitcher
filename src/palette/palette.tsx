import React, { FC, ReactNode } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Icon from '../shared/icon';
import { Brush, Symbol } from '../shared/types';
import { useBrushActions, useBrushState } from '../store';
import StringUtils from '../utils/string-utils';
import BrushSymbol from './brush-symbol';
import ColorPicker from './color-picker';
import SymbolPicker from './symbol-picker';

interface PaletteBrushButtonProps {
  brush: Brush | null;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PaletteBrushButton: FC<PaletteBrushButtonProps> = React.memo(
  ({ brush, ...props }) => {
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
  }
);

interface PopoverButtonProps {
  header: ReactNode;
  content: ReactNode;
  children: ReactNode;
}

const PopoverButton: FC<PopoverButtonProps> = React.memo(
  ({ header, content, children }) => {
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
  }
);

interface CurrentBrushProps {
  brush: Brush | null;
}

const CurrentBrush: FC<CurrentBrushProps> = React.memo(({ brush }) => {
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

const Palette = () => {
  const state = useBrushState();
  const selectedBrush = state.selectedId ? state.byId[state.selectedId] : null;
  const brushActions = useBrushActions();
  const brushList = Object.values(state.byId);

  const handleSelectBrush = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === 'eraser' || value === state.selectedId) {
        brushActions.select(null);
      } else {
        brushActions.select(value);
      }
    },
    [state.selectedId, brushActions]
  );

  const handleCreateBrush = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const brush = {
        id: StringUtils.random(5),
        symbol: Symbol.CROSS,
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
          <CurrentBrush brush={selectedBrush} />

          <ButtonGroup size="sm">
            <PaletteBrushButton
              brush={null}
              checked={!selectedBrush}
              onChange={handleSelectBrush}
            />
            {brushList.map((brush) => (
              <PaletteBrushButton
                key={brush.id}
                brush={brush}
                checked={state.selectedId === brush.id}
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
