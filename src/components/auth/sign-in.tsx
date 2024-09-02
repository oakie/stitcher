import Icon from '@shared/icon';
import { useAuthActions } from '@store';
import { GoogleAuthProvider } from 'firebase/auth';
import { FC } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

interface SignInProps {
  loading: boolean;
}

const SignIn: FC<SignInProps> = ({ loading }) => {
  const { signin } = useAuthActions();
  return (
    <Container className="d-flex flex-column justify-content-center">
      {!loading && (
        <Button variant="outline-secondary" className="mx-auto" onClick={() => signin(google)}>
          Sign in with google <Icon icon={['fab', 'google']} />
        </Button>
      )}
      {loading && (
        <Spinner animation="border" variant="secondary" className="mx-auto" style={{ width: '20vh', height: '20vh' }} />
      )}
    </Container>
  );
};

export default SignIn;
