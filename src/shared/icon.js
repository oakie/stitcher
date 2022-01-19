import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Icon = ({ icon, ...props }) => {
  return (
    <FontAwesomeIcon icon={icon} fixedWidth {...props} />
  );
};

export default React.memo(Icon);