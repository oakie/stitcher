import favicon from '@shared/favicon.svg';
import type { Metadata, Viewport } from 'next';
import React, { FC } from 'react';
import './global.css';

export const metadata: Metadata = {
  title: 'stitcher',
  description: 'Cross-stitching pattern tool',
  icons: {
    icon: favicon.src,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
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
