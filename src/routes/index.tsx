import { MainLayout } from '@layouts';
import { RouteObject } from 'react-router';
import OverviewRoute from './overview-route';
import WorkspaceRoute from './workspace-route';

export const paths = {
  ROOT: '/',
  WORKSPACE: '/workspaces/:workspaceid',
};

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: paths.ROOT,
        element: <OverviewRoute />,
      },
      {
        path: paths.WORKSPACE,
        element: <WorkspaceRoute />,
      },
    ],
  },
] as RouteObject[];
