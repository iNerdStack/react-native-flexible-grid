import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface FlexGridProps {
  renderItem: (item: TileItem, index: number) => ReactNode;
  data: TileItem[];
  maxItemsPerColumn: number;
  scrollEventInterval?: number;
  virtualization?: boolean;
  virtualizedBufferFactor?: number;
  showScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  itemUnitHeight?: number;
}

export interface TileItem {
  widthRatio?: number;
  heightRatio?: number;
  [key: string]: any;
}

export interface GridItem extends TileItem {
  top: number;
  left: number;
  width: number;
  height: number;
}
