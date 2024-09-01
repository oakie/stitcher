import { BaseDialog, BaseDialogProps } from '@components/dialogs';
import { ProfileList } from '@components/profiles';
import { Profile, Workspace } from '@shared/types';
import { useDialogActions, useDialogContext, useProfileActions, useWorkspaceActions } from '@store';
import StringUtils from '@utils/string-utils';
import React, { FC } from 'react';
import { Form } from 'react-bootstrap';

interface WorkspaceShareDialogProps extends BaseDialogProps {
  workspace: Workspace;
}

const WorkspaceShareDialog: FC<WorkspaceShareDialogProps> = ({ dialogid, workspace, ...props }) => {
  const profiles = useProfileActions();
  const workspaces = useWorkspaceActions();
  const context = useDialogContext<void>(dialogid);
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<Profile[]>([]);
  const [owners, setOwners] = React.useState<Profile[]>([]);

  const share = async (userid: string) => {
    await workspaces.share(workspace.id, userid);
  };

  const cancel = async () => {
    context.resolve();
  };

  const refresh = React.useCallback(
    async (term: string) => {
      setSearch(term);
      if (!term) {
        setResults([]);
      } else {
        const hits = await profiles.search(term);
        setResults(hits);
      }
    },
    [profiles]
  );

  React.useEffect(() => {
    profiles.filter(workspace.owners).then((hits) => setOwners(hits));
  }, [profiles, workspace.owners]);

  return (
    <BaseDialog
      dialogid={dialogid}
      {...props}
      show={context.show}
      title={`Share "${workspace.name}"`}
      onCancel={cancel}
    >
      <div className="d-flex flex-column gap-4">
        <ProfileList header="Owners" profiles={owners} />
        <div className="d-flex flex-column gap-2">
          <Form.Group>
            <Form.Label>Share with another user</Form.Label>
            <Form.Control
              type="text"
              value={search}
              onChange={(e) => refresh(e.target.value)}
              autoFocus
              placeholder="Search users"
            />
          </Form.Group>
          {!!results.length && (
            <ProfileList profiles={results} share={(p) => share(p.userid)} disabled={workspace.owners} />
          )}
        </div>
      </div>
    </BaseDialog>
  );
};

export const useWorkspaceShareDialog = () => {
  const dialogs = useDialogActions();

  const open = async (workspace: Workspace) => {
    const id = StringUtils.random(10);
    return await dialogs.open<void>(id, <WorkspaceShareDialog dialogid={id} workspace={workspace} />);
  };

  return { open };
};
