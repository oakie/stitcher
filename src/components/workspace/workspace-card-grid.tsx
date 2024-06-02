import { Workspace } from '@shared/types';
import { useWorkspaces } from '@store';
import { FC } from 'react';
import WorkspaceCard from './workspace-card';
import { useWorkspaceRemoveDialog } from './workspace-remove-dialog';

const WorkspaceCardGrid: FC = () => {
  const { state, actions } = useWorkspaces();
  const remove = useWorkspaceRemoveDialog();

  const workspaces = Object.values(state.byId).sort((lhs, rhs) => rhs.updated.getTime() - lhs.updated.getTime());

  const openRemoveDialog = async (workspace: Workspace) => {
    await remove.open(workspace);
  };

  return (
    <div className="d-flex flex-wrap gap-3">
      {workspaces.map((x) => (
        <WorkspaceCard key={x.id} workspace={x} onClickOpen={() => actions.select(x.id)} onClickRemove={() => openRemoveDialog(x)} />
      ))}
    </div>
  );
};

export default WorkspaceCardGrid;
