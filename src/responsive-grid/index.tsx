/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import type {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type { ResponsiveGridProps, TileItem } from './types';
import { calcResponsiveGrid } from './calc-responsive-grid';
import useThrottle from '../hooks/use-throttle';
import { renderPropComponent } from '../libs/render-prop-component';

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  data = [],
  maxItemsPerColumn = 3,
  virtualizedBufferFactor = 5,
  renderItem,
  autoAdjustItemWidth = true,
  scrollEventInterval = 200, // milliseconds
  virtualization = true,
  showScrollIndicator = true,
  bounces = true,
  style = {},
  itemContainerStyle = {},
  itemUnitHeight,
  onScroll: onScrollProp,
  onEndReached,
  onEndReachedThreshold = 0.5, // default to 50% of the container height
  keyExtractor = (_, index) => String(index), // default to item index if no keyExtractor is provided
  HeaderComponent = null,
  FooterComponent = null,
  direction = 'ltr',
}) => {
  const [visibleItems, setVisibleItems] = useState<TileItem[]>([]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Extract padding values from style prop - renamed for clarity
  const [componentPadding, setComponentPadding] = useState({
    horizontal: 0,
    vertical: 0,
  });

  const onEndReachedCalled = useRef<boolean>(false);

  const scrollYPosition = useRef<number>(0);

  const [footerComponentHeight, setFooterComponentHeight] = useState(0);

  const [headerComponentHeight, setHeaderComponentHeight] = useState(0);

  // Get the effective width accounting for padding
  const effectiveWidth = containerSize.width - componentPadding.horizontal * 2;

  const { gridViewHeight, gridItems } = useMemo(
    () =>
      calcResponsiveGrid(
        data,
        maxItemsPerColumn,
        effectiveWidth > 0 ? effectiveWidth : containerSize.width,
        itemUnitHeight,
        autoAdjustItemWidth
      ),
    [
      data,
      maxItemsPerColumn,
      containerSize,
      effectiveWidth,
      autoAdjustItemWidth,
      itemUnitHeight,
    ]
  );

  const renderedItems = virtualization ? visibleItems : gridItems;

  const sumScrollViewHeight =
    gridViewHeight + headerComponentHeight + footerComponentHeight;

  // Extract padding from style object
  const extractPadding = (styleObj: StyleProp<ViewStyle>) => {
    if (!styleObj) return { horizontal: 0, vertical: 0 };

    const flatStyle = StyleSheet.flatten(styleObj);
    let horizontal = 0;
    let vertical = 0;

    if (flatStyle.padding !== undefined) {
      horizontal = vertical = Number(flatStyle.padding) || 0;
    }

    if (flatStyle.paddingHorizontal !== undefined) {
      horizontal = Number(flatStyle.paddingHorizontal) || 0;
    }

    if (flatStyle.paddingVertical !== undefined) {
      vertical = Number(flatStyle.paddingVertical) || 0;
    }

    if (
      flatStyle.paddingLeft !== undefined ||
      flatStyle.paddingRight !== undefined
    ) {
      const left = Number(flatStyle.paddingLeft) || 0;
      const right = Number(flatStyle.paddingRight) || 0;
      horizontal = Math.max(horizontal, left + right);
    }

    return { horizontal, vertical };
  };

  // Update padding values when style changes when component style is changed
  useEffect(() => {
    const newPadding = extractPadding(style);

    // Only update state if padding values have actually changed
    if (
      newPadding.horizontal !== componentPadding.horizontal ||
      newPadding.vertical !== componentPadding.vertical
    ) {
      setComponentPadding(newPadding);
    }
  }, [style, componentPadding.horizontal, componentPadding.vertical]);

  const updateVisibleItems = () => {
    if (!virtualization) return;

    // Buffer to add outside visible range
    const buffer = containerSize.height * virtualizedBufferFactor;

    // Define the range of items that are visible based on scroll position
    const visibleStart = Math.max(0, scrollYPosition.current - buffer);
    const visibleEnd = scrollYPosition.current + containerSize.height + buffer;

    const vItems = gridItems.filter((item: TileItem) => {
      const itemBottom = item.top + item.height;
      const itemTop = item.top;
      // Check if the item is within the adjusted visible range, including the buffer
      return itemBottom > visibleStart && itemTop < visibleEnd;
    });

    setVisibleItems(vItems);
    return vItems;
  };

  const throttledUpdateVisibleItems = useThrottle(
    updateVisibleItems,
    scrollEventInterval
  );

  const throttledOnScroll = useThrottle(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      scrollYPosition.current = currentScrollY;

      // Calculate the position to check against the threshold
      const contentHeight = gridViewHeight;
      const scrollViewHeight = containerSize.height;
      const threshold = onEndReachedThreshold * scrollViewHeight;

      // Check if we've reached the threshold for calling onEndReached
      if (
        !onEndReachedCalled.current &&
        currentScrollY + scrollViewHeight + threshold >= contentHeight
      ) {
        onEndReachedCalled.current = true; // Marked as called to prevent subsequent calls
        onEndReached?.(); // call the onEndReached function if it exists
      }

      // Reset the flag when scrolled away from the bottom
      if (currentScrollY + scrollViewHeight + threshold * 2 < contentHeight) {
        onEndReachedCalled.current = false;
      }

      // Update visible items for virtualization
      if (virtualization) {
        throttledUpdateVisibleItems();
      }
    },
    32
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScrollProp) {
      onScrollProp(event);
    }

    throttledOnScroll(event);
  };

  useEffect(() => {
    if (virtualization) {
      updateVisibleItems();
    }

    // Reset onEndReachedCalled to false when data changes, allowing onEndReached to be called again
    onEndReachedCalled.current = false;
  }, [gridItems, containerSize, virtualization]);

  const getItemPositionStyle = (item: TileItem) => {
    const baseStyle = {
      position: 'absolute' as const,
      top: item.top,
      width: item.width,
      height: item.height,
    };

    return {
      ...baseStyle,
      ...(direction === 'rtl' ? { right: item.left } : { left: item.left }),
    };
  };

  return (
    <View
      style={[
        {
          flexGrow: 1,
          overflow: 'hidden' as const,
        },
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
      }}
    >
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={onScrollProp ? 0 : 32}
        horizontal={false}
        bounces={bounces}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: sumScrollViewHeight || '100%',
          width: '100%',
        }}
        showsVerticalScrollIndicator={showScrollIndicator}
      >
        {/* Render HeaderComponent if provided */}
        <View
          onLayout={({ nativeEvent }) => {
            setHeaderComponentHeight(nativeEvent.layout.height);
          }}
        >
          {renderPropComponent(HeaderComponent)}
        </View>

        <View
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {renderedItems.map((item, index) => (
            <View
              key={keyExtractor(item, index)}
              style={[getItemPositionStyle(item), itemContainerStyle]}
            >
              {renderItem({ item, index })}
            </View>
          ))}
        </View>

        {/* Render FooterComponent if provided */}
        <View
          onLayout={({ nativeEvent }) => {
            setFooterComponentHeight(nativeEvent.layout.height);
          }}
        >
          {renderPropComponent(FooterComponent)}
        </View>
      </ScrollView>
    </View>
  );
};
