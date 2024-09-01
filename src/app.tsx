import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { StoreProvider } from '@store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from './routes';

library.add(fas);
library.add(fab);

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const router = createBrowserRouter(routes);

const App = () => (
  <AppContainer className="d-flex flex-column">
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </AppContainer>
);

export default App;
