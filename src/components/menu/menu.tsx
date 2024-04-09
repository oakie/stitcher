import { useAuthActions, useAuthState } from '@store';
import { FC } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import styled from 'styled-components';

const Bottom = styled.div``;

interface MenuProps {
  show: boolean;
  onHide: () => void;
}

const Menu: FC<MenuProps> = ({ show, onHide }) => {
  const authstate = useAuthState();
  const authactions = useAuthActions();

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      backdrop={true}
      className="text-bg-dark"
    >
      <Offcanvas.Header closeButton closeVariant='white'>
        <Offcanvas.Title>{authstate.fullname}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column align-items-stretch">
        <Bottom className="d-flex flex-column mt-auto">
          <Button
            variant="link"
            onClick={authactions.signout}
            className="text-secondary align-self-end text-decoration-none fw-bold"
          >
            sign out
          </Button>
        </Bottom>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Menu;
