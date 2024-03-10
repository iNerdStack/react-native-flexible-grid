import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface FlexGridProps {
  maxColumnRatioUnits: number;
  virtualization?: boolean;
  itemSizeUnit: number;
  renderItem: (item: FlexGridTile, index: number) => ReactNode;
  data: FlexGridTile[];
  virtualizedBufferFactor?: number;
  scrollEventInterval?: number;
  showScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
}

export interface FlexGridTile {
  widthRatio?: number;
  heightRatio?: number;
  [key: string]: any;
}

export interface FlexGridItem extends FlexGridTile {
  top: number;
  left: number;
}

export interface CalcFlexGrid {
  gridItems: FlexGridTile[];
  totalHeight: number;
  totalWidth: number;
}
