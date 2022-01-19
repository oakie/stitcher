import React from 'react';
import useResizeObserver from 'use-resize-observer';
import './app.scss';
import Canvas from './canvas';
import Palette from './palette';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Header from './header';

library.add(fas);

const App = () => {
  const { ref, width = 1, height = 1 } = useResizeObserver();
  const size = React.useMemo(() => ({ width, height }), [width, height]);

  return (
    <div className="app overflow-hidden d-flex flex-column">
      <Header className="" />
      <div className="flex-grow-1">
        <Canvas container={ref} size={size} />
      </div>
      <div className="bottom-center">
        <Palette />
      </div>
    </div >
  );
};

export default App;
