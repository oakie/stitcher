import Icon from '@shared/icon';
import { FC } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import styled from 'styled-components';

const NavbarRight = styled.div`
  margin-left: auto;
`;

interface HeaderProps {
  openMenu: () => void;
}

const Header: FC<HeaderProps> = ({ openMenu }) => {
  return (
    <Navbar bg="dark" variant="dark" className="px-2">
      <Navbar.Brand>stitcher</Navbar.Brand>
      <NavbarRight>
        <Button variant="link" onClick={openMenu}>
          <Icon icon="bars" color="white" size="lg" />
        </Button>
      </NavbarRight>
    </Navbar>
  );
};

export default Header;
