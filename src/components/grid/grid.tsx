import { Point, Size } from '@shared/types';
import React, { FC } from 'react';
import { Group, Line } from 'react-konva';
import { useGridBreakpoints } from './hooks';

interface GridLineProps {
  points: number[];
  bold?: boolean;
}

const GridLine: FC<GridLineProps> = React.memo(({ points, bold = false }) => {
  return (
    <Line
      points={points}
      stroke={bold ? '#ccc' : '#eee'}
      strokeScaleEnabled={false}
      strokeWidth={2}
    />
  );
});

export interface GridProps {
  scale: Point;
  size: Size;
  center: Point;
}

const Grid: FC<GridProps> = React.memo(({ scale, size, center }) => {
  const breakpoints = useGridBreakpoints(scale, size, center);
  const thin = {
    x: breakpoints.x.filter((x) => x % 5 !== 0),
    y: breakpoints.y.filter((y) => y % 5 !== 0),
  };
  const bold = {
    x: breakpoints.x.filter((x) => x % 5 === 0),
    y: breakpoints.y.filter((y) => y % 5 === 0),
  };

  return (
    <Group>
      {thin.x.map((x) => (
        <GridLine key={'x:' + x} points={[x, -size.height, x, size.height]} />
      ))}
      {thin.y.map((y) => (
        <GridLine key={'y:' + y} points={[-size.width, y, size.width, y]} />
      ))}
      {bold.x.map((x) => (
        <GridLine
          key={'x:' + x}
          points={[x, -size.height, x, size.height]}
          bold
        />
      ))}
      {bold.y.map((y) => (
        <GridLine
          key={'y:' + y}
          points={[-size.width, y, size.width, y]}
          bold
        />
      ))}
    </Group>
  );
});

export default Grid;
