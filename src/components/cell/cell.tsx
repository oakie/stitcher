import { Shape } from '@shared/types';
import React, { FC } from 'react';
import { Circle, Group, Line } from 'react-konva';

const MARGIN = 0.05;

export interface CellShapeProps {
  color: string;
}

const CellCross: FC<CellShapeProps> = React.memo(({ color }) => {
  const halfStroke = 0.1;
  return (
    <>
      <Line
        points={[halfStroke + MARGIN, halfStroke + MARGIN, 1 - halfStroke - MARGIN, 1 - halfStroke - MARGIN]}
        stroke={color}
        strokeWidth={2 * halfStroke}
        lineCap="round"
        listening={false}
      />
      <Line
        points={[halfStroke + MARGIN, 1 - halfStroke - MARGIN, 1 - halfStroke - MARGIN, halfStroke + MARGIN]}
        stroke={color}
        strokeWidth={2 * halfStroke}
        lineCap="round"
        listening={false}
      />
    </>
  );
});

const CellCircle: FC<CellShapeProps> = React.memo(({ color }) => {
  const halfStroke = 0.1;
  return (
    <Circle
      x={0.5}
      y={0.5}
      radius={0.5 - halfStroke - MARGIN}
      stroke={color}
      strokeWidth={2 * halfStroke}
      listening={false}
    />
  );
});

const CellSquare: FC<CellShapeProps> = React.memo(({ color }) => {
  return (
    <Line
      points={[0 + MARGIN, 0 + MARGIN, 1 - MARGIN, 0 + MARGIN, 1 - MARGIN, 1 - MARGIN, 0 + MARGIN, 1 - MARGIN]}
      closed
      fill={color}
      strokeWidth={0}
      listening={false}
    />
  );
});

const CellDisc: FC<CellShapeProps> = React.memo(({ color }) => {
  return <Circle x={0.5} y={0.5} radius={0.5 - 0.5 * MARGIN} fill={color} strokeWidth={0} listening={false} />;
});

const createShape = (shape: Shape, color: string) => {
  switch (shape) {
    case Shape.CROSS:
      return <CellCross color={color} />;
    case Shape.CIRCLE:
      return <CellCircle color={color} />;
    case Shape.SQUARE:
      return <CellSquare color={color} />;
    case Shape.DISC:
      return <CellDisc color={color} />;
    default:
      return null;
  }
};

export interface CellProps {
  x: number;
  y: number;
  shape: Shape;
  color: string;
}

const Cell: FC<CellProps> = ({ x, y, shape, color }) => {
  const element = React.useMemo(() => createShape(shape, color), [color, shape]);

  return (
    <Group x={x} y={y} listening={false} transformsEnabled="position">
      {element}
    </Group>
  );
};

export default React.memo(Cell);
