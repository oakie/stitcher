import Icon from '@shared/icon';
import { Profile } from '@shared/types';
import React, { FC, HTMLAttributes } from 'react';

interface ProfileAvatarProps extends HTMLAttributes<HTMLElement> {
  profile: Profile;
  size: string;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ profile, size, ...props }) => {
  if (!profile.avatar) {
    return (
      <div
        {...props}
        className="bg-secondary rounded ratio-1x1 d-flex align-items-center justify-content-center"
        style={{ height: size }}
      >
        <Icon icon="user" size="2x" />
      </div>
    );
  }

  return (
    <div className="ratio-1x1">
      <img {...props} className="rounded" src={profile.avatar} style={{ height: size }} alt="avatar" />
    </div>
  );
};

export default ProfileAvatar;
