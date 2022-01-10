import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Popover } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import { useLayerActions } from '../redux/actions';
import { Symbols } from '../shared/constants';
import StringUtils from '../utils/string-utils';
import ColorPicker from './color-picker';
import LayerSymbol from './layer-symbol';
import SymbolPicker from './symbol-picker';

const PaletteLayerButton = React.memo(({ layer, ...props }) => {
  const handleClick = React.useCallback((e) => {
    e.target.blur();
  }, []);

  return (
    <ToggleButton
      variant="outline-dark"
      type="checkbox"
      value={layer.id}
      onClick={handleClick}
      {...props}
    >
      <span style={{ color: layer.color }}>
        <LayerSymbol symbol={layer.symbol} />
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
      <Button variant="light" size="sm" onClick={handleClick}>
        <>{children}</>
      </Button>
    </OverlayTrigger>
  );
};

const CurrentLayer = React.memo(({ layer }) => {
  if (!layer) {
    return null;
  }

  return (
    <ButtonGroup className="mr-5">
      <PopoverButton
        header="Select layer color"
        content={<ColorPicker layer={layer} />}
      >
        <FontAwesomeIcon icon="palette" color={layer.color} />
      </PopoverButton>
      <PopoverButton
        header="Select layer symbol"
        content={<SymbolPicker layer={layer} />}
      >
        <LayerSymbol symbol={layer.symbol} />
      </PopoverButton>
    </ButtonGroup>
  );
});

const selector = (state) => {
  return {
    layers: state.layers.byId,
    selected: state.layers.selectedId
  };
};

const Palette = () => {
  const state = useSelector(selector);
  const layerActions = useLayerActions();
  const layerList = Object.values(state.layers);

  const handleSelectLayer = React.useCallback(
    (e) => {
      if (state.selected === e.target.value) {
        layerActions.select();
      } else {
        layerActions.select(e.target.value);
      }
    },
    [state.selected, layerActions]
  );

  const handleCreateLayer = React.useCallback(
    (e) => {
      e.target.blur();
      const layer = {
        id: StringUtils.random(5),
        symbol: Symbols.CROSS,
        color: '#000'
      };
      layerActions.create(layer);
    },
    [layerActions]
  );

  return (
    <>
      <Card>
        <Card.Body className="p-1">
          <CurrentLayer layer={state.layers[state.selected]} />
          <ButtonGroup toggle size="sm">
            {layerList.map((l) => (
              <PaletteLayerButton
                key={l.id}
                layer={l}
                checked={state.selected === l.id}
                onChange={handleSelectLayer}
              />
            ))}
          </ButtonGroup>
          <Button
            variant="outline-dark"
            onClick={handleCreateLayer}
            size="sm"
            className="ml-3"
          >
            <FontAwesomeIcon icon="plus" />
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default Palette;
