import { useWorkspaceRenameDialog, WorkspaceCardGrid } from '@components/workspace';
import { OverviewProvider } from '@store';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

const OverviewRoute: FC = () => {
  const editdialog = useWorkspaceRenameDialog();
  const openEditDialog = async () => {
    await editdialog.open(null);
  };

  return (
    <OverviewProvider>
      <div className="overflow-auto pb-5" style={{ scrollbarWidth: 'thin' }}>
        <Container className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center">
            <div className="h1 text-light me-auto">Workspaces</div>
            <Button variant="outline-secondary" onClick={openEditDialog}>
              create workspace
            </Button>
          </div>
          <WorkspaceCardGrid />
        </Container>
      </div>
    </OverviewProvider>
  );
};

export default OverviewRoute;
