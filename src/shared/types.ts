export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Profile {
  userid: string;
  email: string;
  name: string;
  avatar: string;
  updated: Date;
  workspaces: string[] | null;
  keywords: string[] | null;
}

export interface Workspace {
  id: string;
  name: string;
  size: Size | null;
  thumbnail: string | null;
  owners: string[];
  created: Date;
  updated: Date;
}

export interface Brush {
  id: string;
  shape: Shape;
  color: string;
}

export interface Stitch {
  id: string;
  x: number;
  y: number;
  brush: string;
}

export enum Shape {
  CROSS = 'cross',
  SQUARE = 'square',
}
