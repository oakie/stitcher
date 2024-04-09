export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Brush {
  id: string;
  symbol: Symbol;
  color: string;
}

export interface Stitch {
  id: string;
  x: number;
  y: number;
  brush: string;
}

export enum Symbol {
  CROSS = 'cross',
  SQUARE = 'square',
}
