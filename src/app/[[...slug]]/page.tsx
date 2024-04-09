import React, { FC } from 'react';
import { ClientOnly } from './client';

export const generateStaticParams = () => [{ slug: [''] }];

const Page: FC = () => <ClientOnly />;

export default Page;
