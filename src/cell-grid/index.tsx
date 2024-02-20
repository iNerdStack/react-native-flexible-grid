/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import { Dimensions, ScrollView, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { CellGridProps, CellItemData } from './types';
import React, { useEffect, useMemo, useState } from 'react';
import { calcCellGrid } from './calc-cell-grid';

export const CellGrid: React.FC<CellGridProps> = ({
  data = [],
  enableVirtualization = true,
  maxWidthRatio = 1,
  cellSize = 50,
  viewportBuffer = 100,
  renderItem,
}) => {
  const [visibleItems, setVisibleItems] = useState<CellItemData[]>([]);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const [scrollPosition, setScrollPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const { totalHeight, totalWidth, gridItems } = useMemo(() => {
    return calcCellGrid(data, maxWidthRatio, cellSize);
  }, [data, maxWidthRatio, cellSize]);

  const renderedList = enableVirtualization ? visibleItems : gridItems;

  const calculateVisibleItems = (offsetX: number, offsetY: number) => {
    if (!enableVirtualization) return;

    const visibleStartX = Math.max(0, offsetX - viewportBuffer);
    const visibleEndX = offsetX + screenWidth + viewportBuffer;

    const visibleStartY = Math.max(0, offsetY - viewportBuffer);
    const visibleEndY = offsetY + screenHeight + viewportBuffer;

    const visible = gridItems.filter((item) => {
      const itemRight = item.left + item.widthRatio * cellSize;
      const itemBottom = item.top + item.heightRatio * cellSize;
      return (
        item.left < visibleEndX &&
        itemRight > visibleStartX &&
        item.top < visibleEndY &&
        itemBottom > visibleStartY
      );
    });

    setVisibleItems(visible);
  };

  const handleHorizontalScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!enableVirtualization) return;

    const { nativeEvent } = event;

    setScrollPosition((prev) => ({ ...prev, x: nativeEvent.contentOffset.x }));
    calculateVisibleItems(nativeEvent.contentOffset.x, scrollPosition.y);
  };

  const handleVerticalScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!enableVirtualization) return;

    const { nativeEvent } = event;

    setScrollPosition((prev) => ({ ...prev, y: nativeEvent.contentOffset.y }));
    calculateVisibleItems(scrollPosition.x, nativeEvent.contentOffset.y);
  };

  useEffect(() => {
    // Initial calculation of visible items
    if (enableVirtualization) {
      calculateVisibleItems(0, 0);
    }
  }, [enableVirtualization]);

  useEffect(() => {
    //recalculate visible items when cellSize or maxWidthRatio or data changes
    if (enableVirtualization) {
      calculateVisibleItems(scrollPosition.x, scrollPosition.y);
    }
  }, [cellSize, maxWidthRatio, data, enableVirtualization]);

  if (!gridItems) {
    return null;
  }

  return (
    <ScrollView
      horizontal={true}
      onScroll={handleHorizontalScroll}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={true}
    >
      <ScrollView
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ height: totalHeight, width: totalWidth }}
        showsVerticalScrollIndicator={true}
      >
        <View
          style={{
            height: totalHeight,
            width: totalWidth,
            position: 'relative',
          }}
        >
          {renderedList.map((item, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                width: item.widthRatio * cellSize,
                height: item.heightRatio * cellSize,
              }}
            >
              {renderItem(item, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};
