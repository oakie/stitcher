import React, { FC } from 'react';
import { Navbar } from 'react-bootstrap';

const Header: FC = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>stitcher</Navbar.Brand>
    </Navbar>
  );
};

export default Header;
