import Canvas from '@components/canvas';
import Palette from '@components/palette';
import { useWorkspaceState, WorkspaceProvider } from '@store';
import React, { FC } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';

const BottomCenter = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;

  > * {
    position: relative;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
`;

const WorkspaceRoute: FC = () => {
  const { workspaceid } = useParams();
  const { ref, width = 1, height = 1 } = useResizeObserver();
  const size = React.useMemo(() => ({ width, height }), [width, height]);
  const { active } = useWorkspaceState();

  return (
    <WorkspaceProvider workspaceid={workspaceid ?? null}>
      {!active && (
        <div className="flex-grow-1 d-flex flex-wrap justify-content-center align-content-center">
          <Spinner animation="border" variant="secondary" style={{ width: '20vh', height: '20vh' }} />
        </div>
      )}
      {active && (
        <>
          <div className="flex-grow-1">
            <Canvas container={ref} size={size} />
          </div>
          <BottomCenter>
            <Palette />
          </BottomCenter>
        </>
      )}
    </WorkspaceProvider>
  );
};

export default WorkspaceRoute;
