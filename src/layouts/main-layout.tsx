import { DialogHost } from '@components/dialogs';
import Header from '@components/header';
import { Menu } from '@components/menu';
import React from 'react';
import { Outlet, useLocation } from 'react-router';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [menuOpenKey, setMenuOpenKey] = React.useState<string | null>(null);
  const showMenu = menuOpenKey === location.key;

  return (
    <>
      <Header openMenu={() => setMenuOpenKey(location.key)} />
      <Outlet />
      <Menu show={showMenu} onHide={() => setMenuOpenKey(null)} />
      <DialogHost />
    </>
  );
};

export default MainLayout;
