import { FC, ReactNode } from 'react';
import { Button, Container } from 'react-bootstrap';
import WorkspaceCardGrid from './workspace-card-grid';
import { useWorkspaceRenameDialog } from './workspace-rename-dialog';
import { useWorkspaceState } from '@store';

interface WorkspaceGuardProps {
  children: ReactNode;
}

const WorkspaceGuard: FC<WorkspaceGuardProps> = ({ children }) => {
  const { active } = useWorkspaceState();
  const editdialog = useWorkspaceRenameDialog();

  if (active) {
    return children;
  }

  const openEditDialog = async () => {
    await editdialog.open(null);
  };

  return (
    <Container className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center">
        <div className="h1 text-light me-auto">Workspaces</div>
        <Button variant="outline-secondary" onClick={openEditDialog}>
          create workspace
        </Button>
      </div>
      <WorkspaceCardGrid />
    </Container>
  );
};

export default WorkspaceGuard;
