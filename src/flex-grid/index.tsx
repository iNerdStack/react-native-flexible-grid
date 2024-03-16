/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import { ScrollView, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { FlexGridProps, FlexGridTile } from './types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calcFlexGrid } from './calc-flex-grid';
import useThrottle from '../hooks/use-throttle';

export const FlexGrid: React.FC<FlexGridProps> = ({
  data = [],
  virtualization = true,
  maxColumnRatioUnits = 1,
  itemSizeUnit = 50,
  scrollEventInterval = 200, // milliseconds
  virtualizedBufferFactor = 2,
  showScrollIndicator = true,
  renderItem = () => null,
  style = {},
  itemContainerStyle = {},
}) => {
  const [visibleItems, setVisibleItems] = useState<FlexGridTile[]>([]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const scrollPosition = useRef<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const { totalHeight, totalWidth, gridItems } = useMemo(() => {
    return calcFlexGrid(data, maxColumnRatioUnits, itemSizeUnit);
  }, [data, maxColumnRatioUnits, itemSizeUnit]);

  const renderedList = virtualization ? visibleItems : gridItems;

  const updateVisibleItems = () => {
    if (!virtualization) return;

    const bufferX = containerSize.width * virtualizedBufferFactor;
    const bufferY = containerSize.height * virtualizedBufferFactor;

    const visibleStartX = Math.max(0, scrollPosition.current.x - bufferX);
    const visibleEndX =
      scrollPosition.current.x + containerSize.width + bufferX;

    const visibleStartY = Math.max(0, scrollPosition.current.y - bufferY);
    const visibleEndY =
      scrollPosition.current.y + containerSize.height + bufferY;

    const vItems = gridItems.filter((item) => {
      const itemRight = item.left + (item.widthRatio || 1) * itemSizeUnit;
      const itemBottom = item.top + (item.heightRatio || 1) * itemSizeUnit;
      return (
        item.left < visibleEndX &&
        itemRight > visibleStartX &&
        item.top < visibleEndY &&
        itemBottom > visibleStartY
      );
    });

    setVisibleItems(vItems);
  };

  const throttledUpdateVisibleItems = useThrottle(
    updateVisibleItems,
    scrollEventInterval
  );

  const onHorizontalScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!virtualization) return;

    const { nativeEvent } = event;

    scrollPosition.current = {
      ...scrollPosition.current,
      x: nativeEvent.contentOffset.x,
    };

    throttledUpdateVisibleItems();
  };

  const onVerticalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!virtualization) return;

    const { nativeEvent } = event;

    scrollPosition.current = {
      ...scrollPosition.current,
      y: nativeEvent.contentOffset.y,
    };

    throttledUpdateVisibleItems();
  };

  useEffect(() => {
    //recalculate visible items when itemSizeUnit or maxColumnRatioUnits or data changes
    if (virtualization) {
      updateVisibleItems();
    }
  }, [itemSizeUnit, maxColumnRatioUnits, data, virtualization, containerSize]);

  if (!renderedList) {
    return null;
  }

  return (
    <View
      style={[{ flexGrow: 1 }, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
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
            }}
          >
            {renderedList.map((item, index) => (
              <View
                key={index}
                style={[
                  {
                    position: 'absolute',
                    top: item.top,
                    left: item.left,
                    width: (item.widthRatio || 1) * itemSizeUnit,
                    height: (item.heightRatio || 1) * itemSizeUnit,
                  },
                  itemContainerStyle,
                ]}
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
