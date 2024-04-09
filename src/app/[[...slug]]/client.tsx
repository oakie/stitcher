'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';

const App = dynamic(() => import('./app'), { ssr: false });

export const ClientOnly: FC = () => {
  return <App />;
};
