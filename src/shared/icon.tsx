import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

export interface IconProps extends FontAwesomeIconProps {}

const Icon: FC<IconProps> = ({ icon, ...props }) => {
  return <FontAwesomeIcon icon={icon} fixedWidth {...props} />;
};

export default React.memo(Icon);
