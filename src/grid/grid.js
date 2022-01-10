import React from 'react';
import { Line, Group } from 'react-konva';
import { useStageGrid } from './hooks';

const StageGridLine = React.memo(({ points, bold }) => {
  return (
    <Line
      points={points}
      stroke={bold ? '#ccc' : '#eee'}
      strokeScaleEnabled={false}
      strokeWidth={2}
    />
  );
});

const StageGrid = React.memo(({ scale, size, center }) => {
  const grid = useStageGrid(scale, size, center);
  const thin = {
    x: grid.x.filter((x) => x % 5 !== 0),
    y: grid.y.filter((y) => y % 5 !== 0)
  };
  const bold = {
    x: grid.x.filter((x) => x % 5 === 0),
    y: grid.y.filter((y) => y % 5 === 0)
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
