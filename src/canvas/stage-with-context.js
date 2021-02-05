import { Stage } from 'react-konva';
import React from 'react';
import { Provider, ReactReduxContext } from 'react-redux';

const StageWithContext = ({ children, ...props }) => {
  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <Stage {...props}>
          <Provider store={store}>{children}</Provider>
        </Stage>
      )}
    </ReactReduxContext.Consumer>
  );
};

export default StageWithContext;
