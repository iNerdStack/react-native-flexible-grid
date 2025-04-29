import type React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';

interface RenderItemProps {
  item: any;
  index: number;
}

export interface ResponsiveGridProps {
  /** Function to extract a unique key for a given item in the list. */
  keyExtractor?: (item: any, index: number) => string;

  /** Function to render each item in the grid. Receives the item and its index as parameters. */
  renderItem: ({ item, index }: RenderItemProps) => ReactNode;

  /** Array of items to be rendered in the grid. Each item should include widthRatio and heightRatio properties. */
  data: TileItem[];

  /** Defines the maximum number of items that can be displayed within a single column of the grid. */
  maxItemsPerColumn: number;

  /**
   *  Prevents width overflow by adjusting items with width ratios that exceed
   *  available columns in their row & width overlap by adjusting items that would overlap with items
   *  extending from previous rows
   * @default true
   */
  autoAdjustItemWidth?: boolean;

  /** Interval in milliseconds at which scroll events are processed for virtualization. Default is 200ms. */
  scrollEventInterval?: number;

  /** Enables virtualization to optimize performance by only rendering visible items. Default is true. */
  virtualization?: boolean;

  /** Factor determining the size of the buffer for virtualization. A higher value preloads more off-screen items. Default is 5. */
  virtualizedBufferFactor?: number;

  /** Controls the visibility of the scroll indicator. Default is true. */
  showScrollIndicator?: boolean;

  /** Style object for the outermost container of the component. */
  style?: StyleProp<ViewStyle>;

  /** Style object applied to the container of each item in the grid. */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /** Defines the base unit height for items within the grid. If not provided, it's calculated based on container width and maxItemsPerColumn. */
  itemUnitHeight?: number;

  /** Callback function triggered when the scroll view is scrolled. */
  onScroll?: (event: ReanimatedScrollEvent) => void;

  /** Callback function triggered when the scroll reaches near the end of the scrollable grid. */
  onEndReached?: () => void;

  /** Threshold for triggering onEndReached. Represented as a fraction of the total content length. Default is 0.5. */
  onEndReachedThreshold?: number;

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

  /**
   * Determines the direction for arranging grid items in the layout: left-to-right (ltr) or right-to-left (rtl).
   * @default ltr
   */
  direction?: 'rtl' | 'ltr';
}

export interface TileItem {
  /** Ratio determining the width of the item relative to the column width. */
  widthRatio?: number;
  /** Ratio determining the height of the item relative to itemUnitHeight or the default height calculation. */
  heightRatio?: number;
  [key: string]: any;
}

export interface GridItem extends TileItem {
  /** Calculated top position of the item in the grid. */
  top: number;
  /** Calculated left position of the item in the grid. */
  left: number;
  /** Calculated width of the item. */
  width: number;
  /** Calculated height of the item. */
  height: number;
}
