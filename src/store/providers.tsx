import { AuthGuard } from '@components/auth';
import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { useAuthState } from './hooks/auth-hooks';
import { useBrushListener } from './hooks/brush-hooks';
import { useProfileListener } from './hooks/profile-hooks';
import { useStitchListener } from './hooks/stitch-hooks';
import { useOverviewListener, useWorkspaceListener } from './hooks/workspace-hooks';
import { store } from './store';

interface OverviewProviderProps {
  children: ReactNode;
}

export const OverviewProvider: FC<OverviewProviderProps> = ({ children }) => {
  const auth = useAuthState();

  useProfileListener(auth.user?.userid || null);
  useOverviewListener(auth.user?.userid || null);

  return children;
};

interface WorkspaceProviderProps {
  workspaceid: string | null;
  children: ReactNode;
}

export const WorkspaceProvider: FC<WorkspaceProviderProps> = ({ workspaceid, children }) => {
  useWorkspaceListener(workspaceid);
  useBrushListener(workspaceid);
  useStitchListener(workspaceid);

  return children;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthGuard>{children}</AuthGuard>
    </Provider>
  );
};
