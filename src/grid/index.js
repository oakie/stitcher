import React from 'react';
import { Line, Group } from 'react-konva';
import { useStageGrid } from './hooks';

const StageGridLine = ({ points, stroke }) => {
  return (
    <Line
      points={points}
      stroke="#e0e0e0"
      strokeScaleEnabled={false}
      strokeWidth={stroke}
    />
  );
};

const StageGrid = ({ scale, size, center }) => {
  const grid = useStageGrid(scale, size, center);

  return (
    <Group>
      {grid.x.map((x) => (
        <StageGridLine
          key={'x:' + x}
          points={[x, -size.height, x, size.height]}
          stroke={x % 5 === 0 ? 2 : 1}
        />
      ))}
      {grid.y.map((y) => (
        <StageGridLine
          key={'y:' + y}
          points={[-size.width, y, size.width, y]}
          stroke={y % 5 === 0 ? 2 : 1}
        />
      ))}
    </Group>
  );
};

export default StageGrid;
