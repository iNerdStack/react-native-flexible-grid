import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
interface RenderItemProps {
  item: any;
  index: number;
}
export interface FlexGridProps {
  keyExtractor?: (item: any, index: number) => string;
  maxColumnRatioUnits: number;
  virtualization?: boolean;
  itemSizeUnit: number;
  renderItem: ({ item, index }: RenderItemProps) => ReactNode;
  data: FlexGridTile[];
  virtualizedBufferFactor?: number;
  scrollEventInterval?: number;
  showScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  onHorizontalEndReachedThreshold?: number;
  onHorizontalEndReached?: () => void;
  onVerticalEndReachedThreshold?: number;
  onVerticalEndReached?: () => void;
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
