import Icon from '@shared/icon';
import { FC } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import favicon from '@shared/favicon.svg';
import Image from 'next/image';
import { useWorkspaces } from '@store';

const NavbarRight = styled.div`
  margin-left: auto;
`;

interface HeaderProps {
  openMenu: () => void;
}

const Header: FC<HeaderProps> = ({ openMenu }) => {
  const workspaces = useWorkspaces();
  return (
    <Navbar className="px-2">
      <Navbar.Brand href="#" className="d-flex align-items-center" onClick={() => workspaces.actions.select(null)}>
        <Image src={favicon} alt={'stitcher'} height={32} /> stitcher
      </Navbar.Brand>
      <NavbarRight>
        <Button variant="link" onClick={openMenu}>
          <Icon icon="bars" color="white" size="lg" />
        </Button>
      </NavbarRight>
    </Navbar>
  );
};

export default Header;
