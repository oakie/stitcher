import { AuthGuard } from '@components/auth';
import Canvas from '@components/canvas';
import Header from '@components/header';
import { Menu } from '@components/menu';
import Palette from '@components/palette';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { store } from '@store';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { styled } from 'styled-components';
import useResizeObserver from 'use-resize-observer';

library.add(fas);
library.add(fab);

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
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <AppContainer className="overflow-hidden d-flex flex-column bg-dark">
      <Provider store={store}>
        <AuthGuard>
          <Header openMenu={() => setShowMenu(true)} />
          <div className="flex-grow-1">
            <Canvas container={ref} size={size} />
          </div>
          <BottomCenter>
            <Palette />
          </BottomCenter>
          <Menu show={showMenu} onHide={() => setShowMenu(false)} />
        </AuthGuard>
      </Provider>
    </AppContainer>
  );
};

export default App;
