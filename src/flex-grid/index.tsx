/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import { ScrollView, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { FlexGridProps, FlexGridTile } from './types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calcFlexGrid } from './calc-flex-grid';
import useThrottle from '../hooks/use-throttle';
import { renderPropComponent } from '../libs/render-prop-component';

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
  keyExtractor = (_, index) => String(index), // default to item index if no keyExtractor is provided
  onHorizontalEndReachedThreshold = 0.5, // default to 50% of the container width
  onHorizontalEndReached,
  onVerticalEndReachedThreshold = 0.5, // default to 50% of the container height
  onVerticalEndReached,
  HeaderComponent = null,
  FooterComponent = null,
}) => {
  const [visibleItems, setVisibleItems] = useState<FlexGridTile[]>([]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const scrollPosition = useRef<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const onEndReachedCalled = useRef<{ x: boolean; y: boolean }>({
    x: false,
    y: false,
  });

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
    const { nativeEvent } = event;

    const currentScrollX = nativeEvent.contentOffset.x;

    scrollPosition.current = {
      ...scrollPosition.current,
      x: nativeEvent.contentOffset.x,
    };

    // Calculate the position to check against the horizontal threshold
    const contentWidth = totalWidth;
    const scrollViewWidth = containerSize.width;
    const threshold = onHorizontalEndReachedThreshold * scrollViewWidth;

    // Check if we've reached the horizontal threshold for calling onHorizontalEndReached
    if (
      !onEndReachedCalled.current.x &&
      currentScrollX + scrollViewWidth + threshold >= contentWidth
    ) {
      onEndReachedCalled.current.x = true; // Marked as called to prevent subsequent calls
      onHorizontalEndReached?.(); // call the onHorizontalEndReached function if it exists
    }

    // Reset the flag when scrolled away from the bottom
    if (currentScrollX + scrollViewWidth + threshold * 2 < contentWidth) {
      onEndReachedCalled.current.x = false;
    }

    if (virtualization) {
      throttledUpdateVisibleItems();
    }
  };

  const onVerticalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event;

    const currentScrollY = nativeEvent.contentOffset.y;

    scrollPosition.current = {
      ...scrollPosition.current,
      y: nativeEvent.contentOffset.y,
    };

    // Calculate the position to check against the vertical threshold
    const contentHeight = totalHeight;
    const scrollViewHeight = containerSize.height;
    const threshold = onVerticalEndReachedThreshold * scrollViewHeight;

    // Check if we've reached the horizontal threshold for calling onVerticalEndReached
    if (
      !onEndReachedCalled.current.y &&
      currentScrollY + scrollViewHeight + threshold >= contentHeight
    ) {
      onEndReachedCalled.current.y = true; // Marked as called to prevent subsequent calls
      onVerticalEndReached?.(); // call the onVerticalEndReached function if it exists
    }

    // Reset the flag when scrolled away from the bottom
    if (currentScrollY + scrollViewHeight + threshold * 2 < contentHeight) {
      onEndReachedCalled.current.y = false;
    }

    if (virtualization) {
      throttledUpdateVisibleItems();
    }
  };

  useEffect(() => {
    //recalculate visible items when itemSizeUnit or maxColumnRatioUnits or data changes
    if (virtualization) {
      updateVisibleItems();
    }

    // Reset onEndReachedCalled to false when data changes, allowing onEndReached functions to be called again
    onEndReachedCalled.current = { x: false, y: false };
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
          {/* Render HeaderComponent if provided */}
          <View>{renderPropComponent(HeaderComponent)}</View>

          <View
            style={{
              flex: 1,
              height: totalHeight,
              width: totalWidth,
            }}
          >
            {renderedList.map((item, index) => (
              <View
                key={keyExtractor(item, index)}
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
                {renderItem({ item, index })}
              </View>
            ))}
          </View>

          {/* Render FooterComponent if provided */}
          <View>{renderPropComponent(FooterComponent)}</View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};
