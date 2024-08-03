import type React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface RenderItemProps {
  item: any;
  index: number;
}

export interface FlexGridProps {
  /** Function to extract a unique key for a given item in the list. */
  keyExtractor?: (item: any, index: number) => string;

  /** Defines the maximum number of ratio units that can be allocated to a single column. Controls the grid layout density and item sizing. */
  maxColumnRatioUnits: number;

  /** Enables virtualization to optimize performance by only rendering visible items. Default is true. */
  virtualization?: boolean;

  /** Defines the base unit size for grid items. Actual item size is calculated by multiplying this with width and height ratios. */
  itemSizeUnit: number;

  /** Function to render each item in the grid. Receives the item and its index as parameters. */
  renderItem: ({ item, index }: RenderItemProps) => ReactNode;

  /** Array of items to be rendered in the grid. Each item should include widthRatio and heightRatio properties. */
  data: FlexGridTile[];

  /** Factor determining the size of the buffer for virtualization. A higher value preloads more off-screen items. Default is 2. */
  virtualizedBufferFactor?: number;

  /** Interval in milliseconds at which scroll events are processed for virtualization. Default is 200ms. */
  scrollEventInterval?: number;

  /** Controls the visibility of the scroll indicator. Default is true. */
  showScrollIndicator?: boolean;

  /** Style object for the outermost container of the component. */
  style?: StyleProp<ViewStyle>;

  /** Style object applied to the container of each item in the grid. */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /** Threshold for triggering onHorizontalEndReached. Represented as a fraction of the total width. Default is 0.5. */
  onHorizontalEndReachedThreshold?: number;

  /** Callback function triggered when horizontal scroll reaches the onHorizontalEndReachedThreshold. */
  onHorizontalEndReached?: () => void;

  /** Threshold for triggering onVerticalEndReached. Represented as a fraction of the total height. Default is 0.5. */
  onVerticalEndReachedThreshold?: number;

  /** Callback function triggered when vertical scroll reaches the onVerticalEndReachedThreshold. */
  onVerticalEndReached?: () => void;

  /** Component to be rendered at the bottom of the grid, after all items. */
  FooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;

  /** Component to be rendered at the top of the grid, before any items. */
  HeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
}

export interface FlexGridTile {
  /** Ratio determining the width of the item relative to itemSizeUnit. */
  widthRatio?: number;
  /** Ratio determining the height of the item relative to itemSizeUnit. */
  heightRatio?: number;
  [key: string]: any;
}

export interface FlexGridItem extends FlexGridTile {
  /** Calculated top position of the item in the grid. */
  top: number;
  /** Calculated left position of the item in the grid. */
  left: number;
}

export interface CalcFlexGrid {
  /** Array of positioned grid items. */
  gridItems: FlexGridTile[];
  /** Total height of the grid. */
  totalHeight: number;
  /** Total width of the grid. */
  totalWidth: number;
}