import React from 'react';
import { Symbols } from '../shared/constants';
import Icon from '../shared/icon';

const symbols = {
  [Symbols.CROSS]: 'times',
  [Symbols.SQUARE]: 'square'
};

const BrushSymbol = React.memo(({ symbol, ...props }) => (
  <Icon icon={symbols[symbol] || 'question-circle'} {...props} />
));

export default BrushSymbol;
