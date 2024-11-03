import type { FlexGridItem, FlexGridTile } from './types';

export const calcFlexGrid = (
  data: FlexGridTile[],
  maxColumnRatioUnits: number,
  itemSizeUnit: number,
  autoAdjustItemWidth: boolean = true
): {
  gridItems: FlexGridItem[];
  totalHeight: number;
  totalWidth: number;
} => {
  const gridItems: FlexGridItem[] = [];
  let columnHeights = new Array(maxColumnRatioUnits).fill(0);

  const findAvailableWidth = (
    startColumn: number,
    currentTop: number
  ): number => {
    let availableWidth = 0;
    let column = startColumn;

    while (column < maxColumnRatioUnits) {
      // Check for protruding items at this column
      const hasProtruding = gridItems.some((item) => {
        const itemBottom = item.top + (item.heightRatio || 1) * itemSizeUnit;
        const itemLeft = Math.floor(item.left / itemSizeUnit);
        const itemRight = itemLeft + (item.widthRatio || 1);

        return (
          item.top < currentTop &&
          itemBottom > currentTop &&
          column >= itemLeft &&
          column < itemRight
        );
      });

      if (hasProtruding) {
        break;
      }

      availableWidth++;
      column++;
    }

    return availableWidth;
  };

  const findEndOfProtrudingItem = (
    column: number,
    currentTop: number
  ): number => {
    const protrudingItem = gridItems.find((item) => {
      const itemBottom = item.top + (item.heightRatio || 1) * itemSizeUnit;
      const itemLeft = Math.floor(item.left / itemSizeUnit);
      const itemRight = itemLeft + (item.widthRatio || 1);

      return (
        item.top < currentTop &&
        itemBottom > currentTop &&
        column >= itemLeft &&
        column < itemRight
      );
    });

    if (protrudingItem) {
      return (
        Math.floor(protrudingItem.left / itemSizeUnit) +
        (protrudingItem.widthRatio || 1)
      );
    }

    return column;
  };

  const findNextColumnIndex = (currentTop: number): number => {
    let nextColumn = 0;
    let maxColumn = -1;

    // Find the right most occupied column at this height
    gridItems.forEach((item) => {
      if (Math.abs(item.top - currentTop) < 0.1) {
        maxColumn = Math.max(
          maxColumn,
          Math.floor(item.left / itemSizeUnit) + (item.widthRatio || 1)
        );
      }
    });

    // If we found items in this row, start after the last one
    if (maxColumn !== -1) {
      nextColumn = maxColumn;
    }

    // Check if there's a protruding item at the next position
    const protrudingEnd = findEndOfProtrudingItem(nextColumn, currentTop);
    if (protrudingEnd > nextColumn) {
      nextColumn = protrudingEnd;
    }

    return nextColumn;
  };

  data.forEach((item) => {
    let widthRatio = item.widthRatio || 1;
    const heightRatio = item.heightRatio || 1;

    // Find shortest column for current row
    let columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const currentTop = columnHeights[columnIndex];

    // Find where this item should be placed in the current row
    columnIndex = findNextColumnIndex(currentTop);

    if (autoAdjustItemWidth) {
      // Get available width considering both row end and protruding items
      const availableWidth = findAvailableWidth(columnIndex, currentTop);
      const remainingWidth = maxColumnRatioUnits - columnIndex;

      // Use the smaller of the two constraints
      const maxWidth = Math.min(availableWidth, remainingWidth);

      if (widthRatio > maxWidth) {
        widthRatio = Math.max(1, maxWidth);
      }
    }

    gridItems.push({
      ...item,
      top: currentTop,
      left: columnIndex * itemSizeUnit,
      widthRatio,
      heightRatio,
    });

    // Update column heights
    for (let i = columnIndex; i < columnIndex + widthRatio; i++) {
      columnHeights[i] = currentTop + heightRatio * itemSizeUnit;
    }
  });

  return {
    gridItems,
    totalHeight: Math.max(...columnHeights),
    totalWidth: maxColumnRatioUnits * itemSizeUnit,
  };
};
