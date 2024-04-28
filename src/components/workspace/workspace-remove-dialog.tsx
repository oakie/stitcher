import { BaseDialog, BaseDialogProps } from '@components/dialogs';
import { Workspace } from '@shared/types';
import { useDialogActions, useDialogContext, useWorkspaceActions } from '@store';
import StringUtils from '@utils/string-utils';
import { FC } from 'react';

interface WorkspaceRemoveDialogProps extends BaseDialogProps {
  workspace: Workspace;
}

const WorkspaceRemoveDialog: FC<WorkspaceRemoveDialogProps> = ({ dialogid, workspace, ...props }) => {
  const context = useDialogContext<void>(dialogid);
  const actions = useWorkspaceActions();

  const submit = async () => {
    try {
      await actions.remove(workspace.id);
      context.resolve();
    } catch (e) {
      context.reject();
    }
  };

  const cancel = async () => {
    context.resolve();
  };

  return (
    <BaseDialog dialogid={dialogid} {...props} show={context.show} title="Delete workspace" onSubmit={submit} onCancel={cancel}>
      Warning, this action will delete &quot;{workspace.name}&quot; and <b>can not</b> be reversed! Continue?
    </BaseDialog>
  );
};

export const useWorkspaceRemoveDialog = () => {
  const dialogs = useDialogActions();

  const open = async (workspace: Workspace) => {
    const id = StringUtils.random(10);
    return await dialogs.open<void>(id, <WorkspaceRemoveDialog dialogid={id} workspace={workspace} />);
  };

  return { open };
};
