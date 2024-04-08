import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { styled } from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import Canvas from './canvas';
import Header from './header';
import Palette from './palette';

library.add(fas);

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const BottomCenter = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;

  > * {
    position: relative;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
`;

const App = () => {
  const { ref, width = 1, height = 1 } = useResizeObserver();
  const size = React.useMemo(() => ({ width, height }), [width, height]);

  return (
    <AppContainer className="overflow-hidden d-flex flex-column">
      <Header className="" />
      <div className="flex-grow-1">
        <Canvas container={ref} size={size} />
      </div>
      <BottomCenter>
        <Palette />
      </BottomCenter>
    </AppContainer>
  );
};

export default App;
