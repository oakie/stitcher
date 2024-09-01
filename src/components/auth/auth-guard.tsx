import { useAuthListener, useAuthState } from '@store';
import { FC, ReactNode } from 'react';
import SignIn from './sign-in';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  useAuthListener();
  const auth = useAuthState();

  if (!auth.user) {
    return <SignIn loading={auth.loading} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
