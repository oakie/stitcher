import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

const Icon: FC<FontAwesomeIconProps> = ({ icon, ...props }) => {
  return <FontAwesomeIcon icon={icon} fixedWidth {...props} />;
};

export default React.memo(Icon);
