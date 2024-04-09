import React, { FC } from 'react';
import { Symbol } from '@shared/types';
import Icon, { IconProps } from '@shared/icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const symbols = {
  [Symbol.CROSS]: 'times' as IconProp,
  [Symbol.SQUARE]: 'square' as IconProp,
};

interface BrushSymbolProps {
  symbol: Symbol;
}

const BrushSymbol: FC<BrushSymbolProps> = React.memo(({ symbol }) => (
  <Icon icon={symbols[symbol] || 'question-circle'} />
));

export default BrushSymbol;
