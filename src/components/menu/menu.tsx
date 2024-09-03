import { WorkspaceCard, useWorkspaceRemoveDialog, useWorkspaceRenameDialog } from '@components/workspace';
import { useWorkspaceShareDialog } from '@components/workspace/workspace-share-dialog';
import { paths } from '@routes';
import { appversion } from '@shared/constants';
import { useAuthActions, useProfileState, useWorkspaces } from '@store';
import { FC } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const Bottom = styled.div``;

interface MenuProps {
  show: boolean;
  onHide: () => void;
}

const Menu: FC<MenuProps> = ({ show, onHide }) => {
  const navigate = useNavigate();
  const { signout } = useAuthActions();
  const { profile } = useProfileState();
  const workspaces = useWorkspaces();
  const rename = useWorkspaceRenameDialog();
  const remove = useWorkspaceRemoveDialog();
  const share = useWorkspaceShareDialog();

  const closeWorkspace = () => {
    navigate('/');
  };

  const renameWorkspace = async () => {
    await rename.open(workspaces.state.active);
  };

  const removeWorkspace = async () => {
    await remove.open(workspaces.state.active!);
    navigate(paths.ROOT);
  };

  const shareWorkspace = async () => {
    await share.open(workspaces.state.active!);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" backdrop={true}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{profile?.name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column align-items-stretch">
        {!!workspaces.state.active && (
          <WorkspaceCard
            workspace={workspaces.state.active}
            onClickClose={closeWorkspace}
            onClickEdit={renameWorkspace}
            onClickRemove={removeWorkspace}
            onClickShare={shareWorkspace}
            expand
          />
        )}

        <Bottom className="d-flex flex-column mt-auto">
          version: v{appversion}
          <Button variant="link-secondary" onClick={signout} className="align-self-end">
            sign out
          </Button>
        </Bottom>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Menu;
