import { paths } from '@routes';
import { environment } from '@shared/constants';
import Icon from '@shared/icon';
import { FC } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Favicon from '@shared/favicon.svg?react';

const NavbarRight = styled.div`
  margin-left: auto;
`;

interface HeaderProps {
  openMenu: () => void;
}

const Header: FC<HeaderProps> = ({ openMenu }) => {
  const navigate = useNavigate();

  return (
    <Navbar className="px-2">
      <Navbar.Brand href="/" className="d-flex align-items-center" onClick={() => navigate(paths.ROOT)}>
        <Favicon title="stitcher" height={32} />
        stitcher
        {environment !== 'prod' && ` [${environment}]`}
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
