import { DialogHost } from '@components/dialogs';
import Header from '@components/header';
import { Menu } from '@components/menu';
import React from 'react';
import { Outlet, useLocation } from 'react-router';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = React.useState(false);

  React.useEffect(() => {
    setShowMenu(false);
  }, [location]);

  return (
    <>
      <Header openMenu={() => setShowMenu(true)} />
      <Outlet />
      <Menu show={showMenu} onHide={() => setShowMenu(false)} />
      <DialogHost />
    </>
  );
};

export default MainLayout;
