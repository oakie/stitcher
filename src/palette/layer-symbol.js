import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Symbols } from '../shared/constants';

const symbols = {
  [Symbols.CROSS]: 'times',
  [Symbols.SQUARE]: 'square'
};

const LayerSymbol = React.memo(({ symbol, ...props }) => (
  <FontAwesomeIcon icon={symbols[symbol] || 'question-circle'} {...props} />
));

export default LayerSymbol;
