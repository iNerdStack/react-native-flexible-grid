import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface RenderItemProps {
  item: any;
  index: number;
}

export interface ResponsiveGridProps {
  keyExtractor?: (item: any, index: number) => string;
  renderItem: ({ item, index }: RenderItemProps) => ReactNode;
  data: TileItem[];
  maxItemsPerColumn: number;
  scrollEventInterval?: number;
  virtualization?: boolean;
  virtualizedBufferFactor?: number;
  showScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemUnitHeight?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
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
