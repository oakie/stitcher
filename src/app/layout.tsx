import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import React, { FC } from 'react';
import './global.css';

export const metadata: Metadata = {
  title: 'stitcher',
  description: 'Cross-stitching pattern tool',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
