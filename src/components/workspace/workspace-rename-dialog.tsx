import { BaseDialog, BaseDialogProps } from '@components/dialogs';
import { Workspace } from '@shared/types';
import { useDialogActions, useDialogContext, useWorkspaceActions } from '@store';
import StringUtils from '@utils/string-utils';
import { FC, useState } from 'react';
import { Form } from 'react-bootstrap';

interface WorkspaceRenameDialogProps extends BaseDialogProps {
  workspace: Workspace | null;
}

const WorkspaceRenameDialog: FC<WorkspaceRenameDialogProps> = ({ dialogid, workspace, ...props }) => {
  const context = useDialogContext<void>(dialogid);
  const actions = useWorkspaceActions();
  const [name, setName] = useState(workspace?.name ?? 'new workspace');

  const submit = async () => {
    try {
      if (!workspace) {
        await actions.create(name);
      } else {
        if (workspace.name !== name) {
          await actions.update(workspace.id, { name });
        }
      }
      context.resolve();
    } catch (e) {
      context.reject();
    }
  };

  const cancel = async () => {
    context.resolve();
  };

  const title = workspace ? 'Edit workspace' : 'Create workspace';

  return (
    <BaseDialog dialogid={dialogid} {...props} show={context.show} title={title} onSubmit={submit} onCancel={cancel}>
      <Form.Group>
        <Form.Label>Workspace name</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Form.Group>
    </BaseDialog>
  );
};

export const useWorkspaceRenameDialog = () => {
  const dialogs = useDialogActions();

  const open = async (workspace: Workspace | null) => {
    const id = StringUtils.random(10);
    return await dialogs.open<void>(id, <WorkspaceRenameDialog dialogid={id} workspace={workspace} />);
  };

  return { open };
};
