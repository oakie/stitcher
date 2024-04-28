import { AuthGuard } from '@components/auth';
import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { useAuthState } from './hooks/auth-hooks';
import { useBrushListener } from './hooks/brush-hooks';
import { useProfileListener, useProfileState } from './hooks/profile-hooks';
import { useStitchListener } from './hooks/stitch-hooks';
import { useWorkspaceListener } from './hooks/workspace-hooks';
import { store } from './store';

interface FirebaseProviderProps {
  children: ReactNode;
}

const FirebaseProvider: FC<FirebaseProviderProps> = ({ children }) => {
  const auth = useAuthState();
  const { profile } = useProfileState();

  useProfileListener(auth.user?.userid || null);
  useWorkspaceListener(auth.user?.userid || null, profile?.active || null);
  useBrushListener(profile?.active || null);
  useStitchListener(profile?.active || null);

  return children;
};

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthGuard>
        <FirebaseProvider>{children}</FirebaseProvider>
      </AuthGuard>
    </Provider>
  );
};

export default StoreProvider;
