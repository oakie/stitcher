import { WorkspaceCard, useWorkspaceRemoveDialog, useWorkspaceRenameDialog } from '@components/workspace';
import { useAuthActions, useAuthState, useWorkspaces } from '@store';
import { FC } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import styled from 'styled-components';

const Bottom = styled.div``;

interface MenuProps {
  show: boolean;
  onHide: () => void;
}

const Menu: FC<MenuProps> = ({ show, onHide }) => {
  const authstate = useAuthState();
  const authactions = useAuthActions();
  const workspaces = useWorkspaces();
  const rename = useWorkspaceRenameDialog();
  const remove = useWorkspaceRemoveDialog();

  const closeWorkspace = () => {
    workspaces.actions.select(null);
    onHide();
  };

  const renameWorkspace = async () => {
    await rename.open(workspaces.state.active);
  };

  const removeWorkspace = async () => {
    await remove.open(workspaces.state.active!);
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" backdrop={true}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{authstate.user?.name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column align-items-stretch">
        {!!workspaces.state.active && (
          <WorkspaceCard
            workspace={workspaces.state.active}
            onClickClose={closeWorkspace}
            onClickEdit={renameWorkspace}
            onClickRemove={removeWorkspace}
            expand
          />
        )}

        <Bottom className="d-flex flex-column mt-auto">
          <Button variant="link-secondary" onClick={authactions.signout} className="align-self-end">
            sign out
          </Button>
        </Bottom>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Menu;
