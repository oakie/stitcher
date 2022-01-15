import React from 'react';
import { Group, Line } from 'react-konva';
import { Symbols } from '../shared/constants';

const CellCross = React.memo(({ color }) => {
  const halfStroke = 0.1;
  return (
    <>
      <Line
        points={[halfStroke, halfStroke, 1 - halfStroke, 1 - halfStroke]}
        stroke={color}
        strokeWidth={2 * halfStroke}
        lineCap="round"
        listening={false}
        transformsEnabled=""
      />
      <Line
        points={[halfStroke, 1 - halfStroke, 1 - halfStroke, halfStroke]}
        stroke={color}
        strokeWidth={2 * halfStroke}
        lineCap="round"
        listening={false}
        transformsEnabled=""
      />
    </>
  );
});

const CellSquare = React.memo(({ color }) => {
  return (
    <Line
      points={[0, 0, 1, 0, 1, 1, 0, 1]}
      closed
      fill={color}
      stroke={color}
      strokeWidth={0}
      listening={false}
      transformsEnabled=""
    />
  );
});

const createShape = (symbol, color) => {
  if (symbol === Symbols.CROSS) {
    return <CellCross color={color} />;
  }
  if (symbol === Symbols.SQUARE) {
    return <CellSquare color={color} />;
  }
  return null;
};

const Cell = ({ x, y, symbol, color }) => {
  const shape = React.useMemo(() => createShape(symbol, color), [
    color,
    symbol
  ]);

  return (
    <Group x={x} y={y} listening={false} transformsEnabled="position">
      {shape}
    </Group>
  );
};

export default React.memo(Cell);
