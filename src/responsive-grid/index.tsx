/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { ResponsiveGridProps, TileItem } from './types';
import { calcResponsiveGrid } from './calc-responsive-grid';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import useThrottle from '../hooks/use-throttle';

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  data = [],
  maxItemsPerColumn = 3,
  virtualizedBufferFactor = 5,
  renderItem,
  scrollEventInterval = 200, // milliseconds
  virtualization = true,
  showScrollIndicator = true,
  style = {},
  itemContainerStyle = {},
  itemUnitHeight,
}) => {
  const [visibleItems, setVisibleItems] = useState<TileItem[]>([]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const scrollYPosition = useRef<number>(0);

  const { gridViewHeight, gridItems } = useMemo(
    () =>
      calcResponsiveGrid(
        data,
        maxItemsPerColumn,
        containerSize.width,
        itemUnitHeight
      ),
    [data, maxItemsPerColumn, containerSize]
  );

  const renderedItems = virtualization ? visibleItems : gridItems;

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

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!virtualization) return;

    const currentScrollY = event.nativeEvent.contentOffset.y;

    scrollYPosition.current = currentScrollY;

    throttledUpdateVisibleItems();
  };

  useEffect(() => {
    if (virtualization) {
      updateVisibleItems();
    }
  }, [gridItems, containerSize, virtualization]);

  return (
    <View
      style={[{ flexGrow: 1 }, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
      }}
    >
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{
          height: gridViewHeight,
          width: containerSize.width,
        }}
        showsVerticalScrollIndicator={showScrollIndicator}
      >
        <View
          style={{
            height: gridViewHeight,
            width: containerSize.width,
          }}
        >
          {renderedItems.map((item, index) => (
            <View
              key={index}
              style={[
                {
                  position: 'absolute',
                  top: item.top,
                  left: item.left,
                  width: item.width,
                  height: item.height,
                },
                itemContainerStyle,
              ]}
            >
              {renderItem(item, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
