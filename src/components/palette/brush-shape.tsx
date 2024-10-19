import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '@shared/icon';
import { Shape } from '@shared/types';
import React, { FC } from 'react';

const shapes = {
  [Shape.CROSS]: ['fas', 'xmark'] as IconProp,
  [Shape.CIRCLE]: ['far', 'circle'] as IconProp,
  [Shape.SQUARE]: ['fas', 'square'] as IconProp,
  [Shape.DISC]: ['fas', 'circle'] as IconProp,
};

interface BrushShapeProps {
  shape: Shape;
}

const BrushShape: FC<BrushShapeProps> = React.memo(({ shape }) => <Icon icon={shapes[shape] || 'question-circle'} />);

export default BrushShape;
