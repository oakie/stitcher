import { Profile } from '@shared/types';
import { FC } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import ProfileAvatar from './profile-avatar';

interface ProfileListProps {
  header?: string;
  profiles: Profile[];
  share?: (_: Profile) => void;
  disabled?: string[];
}

const ProfileList: FC<ProfileListProps> = ({ header, profiles, share, disabled }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {header && <span>{header}</span>}
      <ListGroup>
        {profiles.map((x) => (
          <ListGroupItem key={x.userid} className="d-flex align-items-center gap-2 px-2">
            <ProfileAvatar profile={x} size="2.5rem" />
            <div className="flex-grow-1 d-flex flex-column">
              <div>{x.name}</div>
              <small className="lh-1">{x.email}</small>
            </div>
            {share && (
              <Button onClick={() => share(x)} disabled={disabled?.includes(x.userid)}>
                Share
              </Button>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default ProfileList;
