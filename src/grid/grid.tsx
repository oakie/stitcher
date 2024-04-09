import React, { FC } from 'react';
import { Line, Group } from 'react-konva';
import { useGridBreakpoints } from './hooks';
import { Point, Size } from '../shared/types';

interface StageGridLineProps {
  points: number[];
  bold?: boolean;
}

const StageGridLine: FC<StageGridLineProps> = React.memo(
  ({ points, bold = false }) => {
    return (
      <Line
        points={points}
        stroke={bold ? '#ccc' : '#eee'}
        strokeScaleEnabled={false}
        strokeWidth={2}
      />
    );
  }
);

export interface StageGridProps {
  scale: Point;
  size: Size;
  center: Point;
}

const StageGrid: FC<StageGridProps> = React.memo(({ scale, size, center }) => {
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
        <StageGridLine
          key={'x:' + x}
          points={[x, -size.height, x, size.height]}
        />
      ))}
      {thin.y.map((y) => (
        <StageGridLine
          key={'y:' + y}
          points={[-size.width, y, size.width, y]}
        />
      ))}
      {bold.x.map((x) => (
        <StageGridLine
          key={'x:' + x}
          points={[x, -size.height, x, size.height]}
          bold
        />
      ))}
      {bold.y.map((y) => (
        <StageGridLine
          key={'y:' + y}
          points={[-size.width, y, size.width, y]}
          bold
        />
      ))}
    </Group>
  );
});

export default StageGrid;
