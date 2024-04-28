import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '@shared/icon';
import { Shape } from '@shared/types';
import React, { FC } from 'react';

const shapes = {
  [Shape.CROSS]: 'times' as IconProp,
  [Shape.SQUARE]: 'square' as IconProp,
};

interface BrushShapeProps {
  shape: Shape;
}

const BrushShape: FC<BrushShapeProps> = React.memo(({ shape }) => <Icon icon={shapes[shape] || 'question-circle'} />);

export default BrushShape;
