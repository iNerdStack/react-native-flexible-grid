import type { ReactNode } from 'react';

export interface CellGridProps {
  maxWidthRatio: number;
  enableVirtualization?: boolean;
  cellSize: number;
  renderItem: (item: CellItemData, index: number) => ReactNode;
  data: CellItemData[];
  viewportBuffer?: number;
}

export interface CellItemData {
  widthRatio: number;
  heightRatio: number;
  [key: string]: any;
}

export interface GridItem extends CellItemData {
  top: number;
  left: number;
}

export interface CalcCellGrid {
  gridItems: GridItem[];
  totalHeight: number;
  totalWidth: number;
}
