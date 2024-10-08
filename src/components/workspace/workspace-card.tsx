import Icon from '@shared/icon';
import { Workspace } from '@shared/types';
import { format } from 'date-fns';
import { FC } from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import styled from 'styled-components';

const StyledCard = styled(Card)<{ $expand: boolean }>`
  width: ${(p) => (p.$expand ? '100%' : '18rem')};
`;

const ThumbnailWrapper = styled.div`
  height: 8rem;
  padding: 1rem;
  background-color: white;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  cursor: pointer;
`;

const Thumbnail = styled.img`
  height: 100%;
  object-fit: fill;
  image-rendering: pixelated;
`;

interface WorkspaceCardProps {
  workspace: Workspace;
  onClickOpen?: () => void;
  onClickClose?: () => void;
  onClickEdit?: () => void;
  onClickRemove?: () => void;
  onClickShare?: () => void;
  expand?: boolean;
}

const WorkspaceCard: FC<WorkspaceCardProps> = ({
  workspace,
  onClickOpen,
  onClickClose,
  onClickEdit,
  onClickRemove,
  onClickShare,
  expand = false,
}) => {
  return (
    <StyledCard $expand={expand} border="secondary">
      <Card.Header className="d-flex align-items-center gap-1">
        <Card.Title className="mb-0 text-nowrap text-truncate">{workspace.name}</Card.Title>
        <div className="d-flex flex-shrink-0 ms-auto">
          {onClickEdit && (
            <Button variant="link" size="sm" className="text-light p-1" onClick={onClickEdit}>
              <Icon icon="pen" />
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Stack gap={2}>
          <ThumbnailWrapper className="d-flex align-items-center" onClick={onClickOpen}>
            {workspace.thumbnail && <Thumbnail src={workspace.thumbnail} className="mx-auto" />}
          </ThumbnailWrapper>
          <Stack>
            {workspace.size && (
              <span>
                dimensions: {workspace.size.width} &times; {workspace.size.height}
              </span>
            )}
            <span>created: {workspace.created && format(workspace.created, 'yyyy-MM-dd')}</span>
            <span>modified: {workspace.updated && format(workspace.updated, 'yyyy-MM-dd')}</span>
          </Stack>
        </Stack>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <div>
          {onClickShare && (
            <Button variant="link" size="sm" className="text-light p-1" onClick={onClickShare}>
              <Icon icon="share-alt" />
            </Button>
          )}
          {onClickRemove && (
            <Button variant="link" size="sm" className="text-light p-1" onClick={onClickRemove}>
              <Icon icon="trash" />
            </Button>
          )}
        </div>
        <div>
          {onClickOpen && (
            <Button variant="link-secondary p-0" onClick={onClickOpen}>
              open
            </Button>
          )}
          {onClickClose && (
            <Button variant="link-secondary p-0" onClick={onClickClose}>
              close
            </Button>
          )}
        </div>
      </Card.Footer>
    </StyledCard>
  );
};

export default WorkspaceCard;
