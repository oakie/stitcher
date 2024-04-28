import Icon from '@shared/icon';
import { Workspace } from '@shared/types';
import { format } from 'date-fns';
import { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components';

const StyledCard = styled(Card)<{ $expand: boolean }>`
  width: ${(p) => (p.$expand ? '100%' : '18rem')};
`;

const StyledSubtitle = styled(Card.Subtitle)`
  font-weight: 100 !important;
`;

interface WorkspaceCardProps {
  workspace: Workspace;
  onClickOpen?: () => void;
  onClickClose?: () => void;
  onClickEdit?: () => void;
  onClickRemove?: () => void;
  expand?: boolean;
}

const WorkspaceCard: FC<WorkspaceCardProps> = ({ workspace, onClickOpen, onClickClose, onClickEdit, onClickRemove: onClickDelete, expand = false }) => {
  return (
    <StyledCard $expand={expand} border="secondary">
      <Card.Body>
        <Card.Title className="d-flex align-items-center gap-1">
          <div className="text-nowrap text-truncate">{workspace.name}</div>
          <Button variant="link" size="sm" className="text-light flex-shrink-0" onClick={onClickEdit}>
            <Icon icon="pen" />
          </Button>
          <Button variant="link" size="sm" className="text-light flex-shrink-0 ms-auto" onClick={onClickDelete}>
            <Icon icon="trash" />
          </Button>
        </Card.Title>
        <StyledSubtitle className="mb-4">created {format(workspace.created, 'yyyy-MM-dd')}</StyledSubtitle>
        <div className="d-flex justify-content-between flex-row-reverse">
          {onClickOpen && (
            <Button variant="link-secondary" onClick={onClickOpen}>
              open
            </Button>
          )}
          {onClickClose && (
            <Button variant="link-secondary" onClick={onClickClose}>
              close
            </Button>
          )}
        </div>
      </Card.Body>
    </StyledCard>
  );
};

export default WorkspaceCard;
