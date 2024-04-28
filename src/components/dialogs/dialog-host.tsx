import { useDialogState } from '@store';
import React, { FC } from 'react';

const DialogHost: FC = () => {
  const { stack } = useDialogState();

  return (
    <>
      {stack.map((x) => (
        <React.Fragment key={x.id}>{x.component}</React.Fragment>
      ))}
    </>
  );
};

export default DialogHost;
