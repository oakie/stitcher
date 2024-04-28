import { Brush, Profile, Stitch, Workspace } from '@shared/types';
import { ReactNode } from 'react';

export interface WorkspaceState {
  active: Workspace | null;
  byId: {
    [key: string]: Workspace;
  };
}

export interface ProfileState {
  profile: Profile | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface User {
  userid: string;
  email: string;
  name: string;
}

export interface StitchState {
  byId: {
    [key: string]: Stitch;
  };
}

export interface BrushState {
  byId: {
    [key: string]: Brush;
  };
  selected: Brush | null;
}

export interface DialogContext<TResult> {
  id: string;
  component: ReactNode;
  promise: Promise<TResult>;
  resolve: (value: TResult | PromiseLike<TResult>) => void;
  reject: (reason?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface DialogState {
  stack: DialogContext<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}
