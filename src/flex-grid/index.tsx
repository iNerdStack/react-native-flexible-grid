/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import { ScrollView, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { FlexGridProps, FlexGridTile } from './types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calcFlexGrid } from './calc-flex-grid';

export const FlexGrid: React.FC<FlexGridProps> = ({
  data = [],
  virtualization = true,
  maxWidthRatio = 1,
  tileSize = 50,
  scrollEventInterval = 200, // milliseconds
  virtualizedBufferFactor = 2,
  showScrollIndicator = true,
  renderItem,
  style = {},
}) => {
  const [visibleItems, setVisibleItems] = useState<FlexGridTile[]>([]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollPosition = useRef<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const throttleScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const { totalHeight, totalWidth, gridItems } = useMemo(() => {
    return calcFlexGrid(data, maxWidthRatio, tileSize);
  }, [data, maxWidthRatio, tileSize]);

  const renderedList = virtualization ? visibleItems : gridItems;

  const updateVisibleItems = () => {
    if (!virtualization) return;

    const bufferX = containerWidth * virtualizedBufferFactor;
    const bufferY = containerHeight * virtualizedBufferFactor;

    const visibleStartX = Math.max(0, scrollPosition.current.x - bufferX);
    const visibleEndX = scrollPosition.current.x + containerWidth + bufferX;

    const visibleStartY = Math.max(0, scrollPosition.current.y - bufferY);
    const visibleEndY = scrollPosition.current.y + containerHeight + bufferY;

    const vItems = gridItems.filter((item) => {
      const itemRight = item.left + (item.widthRatio || 1) * tileSize;
      const itemBottom = item.top + (item.heightRatio || 1) * tileSize;
      return (
        item.left < visibleEndX &&
        itemRight > visibleStartX &&
        item.top < visibleEndY &&
        itemBottom > visibleStartY
      );
    });

    setVisibleItems(vItems);
  };

  const onHorizontalScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!virtualization) return;

    const { nativeEvent } = event;

    scrollPosition.current = {
      ...scrollPosition.current,
      x: nativeEvent.contentOffset.x,
    };

    if (throttleScrollTimeout.current !== null) {
      return;
    }

    throttleScrollTimeout.current = setTimeout(() => {
      updateVisibleItems();

      throttleScrollTimeout.current = null;
    }, scrollEventInterval);
  };

  const onVerticalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!virtualization) return;

    const { nativeEvent } = event;

    scrollPosition.current = {
      ...scrollPosition.current,
      y: nativeEvent.contentOffset.y,
    };

    if (throttleScrollTimeout.current !== null) {
      return;
    }

    throttleScrollTimeout.current = setTimeout(() => {
      updateVisibleItems();

      throttleScrollTimeout.current = null;
    }, scrollEventInterval);
  };

  useEffect(() => {
    //recalculate visible items when tileSize or maxWidthRatio or data changes
    if (virtualization) {
      updateVisibleItems();
    }
  }, [
    tileSize,
    maxWidthRatio,
    data,
    virtualization,
    containerHeight,
    containerWidth,
  ]);

  if (!renderedList) {
    return null;
  }

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
        horizontal={true}
        onScroll={onHorizontalScroll}
        scrollEventThrottle={32}
        showsHorizontalScrollIndicator={showScrollIndicator}
      >
        <ScrollView
          onScroll={onVerticalScroll}
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={showScrollIndicator}
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
                  width: (item.widthRatio || 1) * tileSize,
                  height: (item.heightRatio || 1) * tileSize,
                }}
              >
                {renderItem(item, index)}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};
