import Canvas from '@components/canvas';
import Header from '@components/header';
import Palette from '@components/palette';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { styled } from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { store } from '@store';

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

const App: FC = () => {
  const { ref, width = 1, height = 1 } = useResizeObserver();
  const size = React.useMemo(() => ({ width, height }), [width, height]);

  return (
    <AppContainer className="overflow-hidden d-flex flex-column">
      <Provider store={store}>
        <Header />
        <div className="flex-grow-1">
          <Canvas container={ref} size={size} />
        </div>
        <BottomCenter>
          <Palette />
        </BottomCenter>
      </Provider>
    </AppContainer>
  );
};

export default App;
