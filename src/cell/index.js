import React from 'react';
import { Group, Line } from 'react-konva';
import { useSelector } from 'react-redux';

const selector = (id) => {
  return (state) => state.cells.byId[id];
};

const Cell = ({ id }) => {
  const cell = useSelector(selector(id));
  return (
    <Group x={cell.x} y={cell.y} transformsEnabled="position">
      <Line
        points={[0, 0, 1, 1]}
        stroke="green"
        strokeWidth={0.1}
        transformsEnabled={false}
      />
      <Line
        points={[0, 1, 1, 0]}
        stroke="green"
        strokeWidth={0.1}
        transformsEnabled={false}
      />
    </Group>
  );
};

export default Cell;
