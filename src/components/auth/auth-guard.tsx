import { useAuthState } from '@store';
import { FC, ReactNode } from 'react';
import SignIn from './sign-in';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const auth = useAuthState();

  if (!auth.username) {
    return <SignIn loading={auth.loading} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
