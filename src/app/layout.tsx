import type { Metadata } from 'next';
import React, { FC } from 'react';
import favicon from '@shared/favicon.svg';
import './global.css';

export const metadata: Metadata = {
  title: 'stitcher',
  description: 'Cross-stitching pattern tool',
  icons: {
    icon: favicon.src,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
