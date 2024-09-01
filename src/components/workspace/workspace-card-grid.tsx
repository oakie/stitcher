import { Workspace } from '@shared/types';
import { useWorkspaceState } from '@store';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import WorkspaceCard from './workspace-card';
import { useWorkspaceRemoveDialog } from './workspace-remove-dialog';
import { useWorkspaceRenameDialog } from './workspace-rename-dialog';
import { useWorkspaceShareDialog } from './workspace-share-dialog';

const WorkspaceCardGrid: FC = () => {
  const navigate = useNavigate();
  const state = useWorkspaceState();
  const rename = useWorkspaceRenameDialog();
  const remove = useWorkspaceRemoveDialog();
  const share = useWorkspaceShareDialog();

  const workspaces = Object.values(state.byId).sort(
    (lhs, rhs) => rhs.updated?.getTime() ?? 0 - lhs.updated.getTime() ?? 0
  );

  const openRenameDialog = async (workspace: Workspace) => {
    await rename.open(workspace);
  };

  const openRemoveDialog = async (workspace: Workspace) => {
    await remove.open(workspace);
  };

  const openShareDialog = async (workspace: Workspace) => {
    share.open(workspace);
  };

  return (
    <div className="d-flex flex-wrap gap-3">
      {workspaces.map((x) => (
        <WorkspaceCard
          key={x.id}
          workspace={x}
          onClickOpen={() => navigate(`/workspaces/${x.id}`)}
          onClickEdit={() => openRenameDialog(x)}
          onClickRemove={() => openRemoveDialog(x)}
          onClickShare={() => openShareDialog(x)}
        />
      ))}
    </div>
  );
};

export default WorkspaceCardGrid;
