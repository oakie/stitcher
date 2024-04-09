import { Brush, Stitch } from '@shared/types';

export interface AuthState {
  username: string | null;
  fullname: string | null;
  loading: boolean;
}

export interface User {
  email: string | null;
  name: string | null;
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
