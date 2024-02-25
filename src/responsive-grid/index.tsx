/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { FlexGridProps, TileItem } from './types';
import { calcResponsiveGrid } from './calc-responsive-grid';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export const ResponsiveGrid: React.FC<FlexGridProps> = ({
  data = [],
  maxItemsPerColumn = 3,
  virtualizedBufferFactor = 5,
  renderItem,
  scrollEventInterval = 200, // milliseconds
  virtualization = true,
  showScrollIndicator = true,
  style = {},
  tileHeight,
}) => {
  const [visibleItems, setVisibleItems] = useState<TileItem[]>([]);
  const throttleScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollYPosition = useRef<number>(0);

  const { gridViewHeight, gridItems } = useMemo(
    () =>
      calcResponsiveGrid(data, maxItemsPerColumn, containerWidth, tileHeight),
    [data, maxItemsPerColumn, containerWidth]
  );

  const renderedItems = virtualization ? visibleItems : gridItems;

  const updateVisibleItems = () => {
    if (!virtualization) return;

    // Buffer to add outside visible range
    const buffer = containerHeight * virtualizedBufferFactor;

    // Define the range of items that are visible based on scroll position
    const visibleStart = Math.max(0, scrollYPosition.current - buffer);
    const visibleEnd = scrollYPosition.current + containerHeight + buffer;

    const vItems = gridItems.filter((item: TileItem) => {
      const itemBottom = item.top + item.height;
      const itemTop = item.top;
      // Check if the item is within the adjusted visible range, including the buffer
      return itemBottom > visibleStart && itemTop < visibleEnd;
    });

    setVisibleItems(vItems);
    return vItems;
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If virtualization is disabled, return
    if (!virtualization) return;

    const currentScrollY = event.nativeEvent.contentOffset.y;

    scrollYPosition.current = currentScrollY;

    // Throttling logic
    if (throttleScrollTimeout.current !== null) {
      return;
    }

    throttleScrollTimeout.current = setTimeout(() => {
      updateVisibleItems();

      throttleScrollTimeout.current = null;
    }, scrollEventInterval);
  };

  useEffect(() => {
    if (virtualization) {
      updateVisibleItems();
    }
  }, [gridItems, containerHeight, containerWidth, virtualization]);

  return (
    <View
      style={[{ flexGrow: 1 }, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
    >
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{
          height: gridViewHeight,
          width: containerWidth,
        }}
        showsVerticalScrollIndicator={showScrollIndicator}
      >
        <View
          style={{
            height: gridViewHeight,
            width: containerWidth,
          }}
        >
          {renderedItems.map((item, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                width: item.width,
                height: item.height,
              }}
            >
              {renderItem(item, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
