import { Workspace } from '@shared/types';
import { useWorkspaces } from '@store';
import { FC } from 'react';
import WorkspaceCard from './workspace-card';
import { useWorkspaceRenameDialog } from './workspace-rename-dialog';
import { useWorkspaceRemoveDialog } from './workspace-remove-dialog';

const WorkspaceCardGrid: FC = () => {
  const { state, actions } = useWorkspaces();
  const rename = useWorkspaceRenameDialog();
  const remove = useWorkspaceRemoveDialog();

  const workspaces = Object.values(state.byId).sort((lhs, rhs) => rhs.updated.getTime() - lhs.updated.getTime());

  const openRenameDialog = async (workspace: Workspace) => {
    await rename.open(workspace);
  };

  const openRemoveDialog = async (workspace: Workspace) => {
    await remove.open(workspace);
  };

  return (
    <div className="d-flex flex-wrap gap-3">
      {workspaces.map((x) => (
        <WorkspaceCard
          key={x.id}
          workspace={x}
          onClickOpen={() => actions.select(x.id)}
          onClickEdit={() => openRenameDialog(x)}
          onClickRemove={() => openRemoveDialog(x)}
        />
      ))}
    </div>
  );
};

export default WorkspaceCardGrid;
