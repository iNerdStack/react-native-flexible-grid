import type { GridItem, TileItem } from './types';

export const calcResponsiveGrid = (
  data: TileItem[],
  maxItemsPerColumn: number,
  containerWidth: number,
  itemUnitHeight?: number,
  autoAdjustItemWidth: boolean = true
): {
  gridItems: GridItem[];
  gridViewHeight: number;
} => {
  const gridItems: GridItem[] = [];
  const itemSizeUnit = containerWidth / maxItemsPerColumn;
  let columnHeights: number[] = new Array(maxItemsPerColumn).fill(0);

  const findAvailableWidth = (
    startColumn: number,
    currentTop: number
  ): number => {
    // Check each column from the start position
    let availableWidth = 0;

    for (let i = startColumn; i < maxItemsPerColumn; i++) {
      // Check if there's any item from above rows protruding into this space
      const hasProtrudingItem = gridItems.some((item) => {
        const itemBottom = item.top + item.height;
        const itemRight = item.left + item.width;
        return (
          item.top < currentTop && // Item starts above current row
          itemBottom > currentTop && // Item extends into current row
          item.left <= i * itemSizeUnit && // Item starts at or before this column
          itemRight > i * itemSizeUnit // Item extends into this column
        );
      });

      if (hasProtrudingItem) {
        break; // Stop counting available width when we hit a protruding item
      }

      availableWidth++;
    }

    return availableWidth;
  };

  data.forEach((item) => {
    let widthRatio = item.widthRatio || 1;
    const heightRatio = item.heightRatio || 1;

    let columnIndex = findColumnForItem(
      columnHeights,
      widthRatio,
      maxItemsPerColumn
    );

    if (autoAdjustItemWidth) {
      // Get current row's height at the column index
      const currentTop = columnHeights[columnIndex];

      // Calculate available width considering both row end and protruding items
      const availableWidth = findAvailableWidth(columnIndex, currentTop!);

      // If widthRatio exceeds available space, adjust it
      if (widthRatio > availableWidth) {
        widthRatio = availableWidth;
      }
    }

    const itemWidth = widthRatio * itemSizeUnit;
    const itemHeight = itemUnitHeight
      ? itemUnitHeight * heightRatio
      : heightRatio * itemSizeUnit;

    const top = columnHeights[columnIndex]!;
    const left = columnIndex * itemSizeUnit;

    gridItems.push({
      ...item,
      top,
      left,
      width: itemWidth,
      height: itemHeight,
    });

    // Update the column heights
    for (let i = columnIndex; i < columnIndex + widthRatio; i++) {
      columnHeights[i] = top + itemHeight;
    }
  });

  return {
    gridItems,
    gridViewHeight: Math.max(...columnHeights),
  };
};

const findColumnForItem = (
  columnHeights: number[],
  widthRatio: number,
  maxItemsPerColumn: number
) => {
  // If the item spans only one column, find the shortest column.
  if (widthRatio === 1) {
    return columnHeights.indexOf(Math.min(...columnHeights));
  }

  // If the item spans multiple columns, find the first place it can fit.
  let minHeight = Math.min(...columnHeights);
  let columnIndex = columnHeights.indexOf(minHeight);

  for (let i = 0; i <= maxItemsPerColumn - widthRatio; i++) {
    // Check if the item can fit in the next 'widthRatio' columns.
    const columnsToCheck = columnHeights.slice(i, i + widthRatio);
    if (columnsToCheck.every((height) => height === minHeight)) {
      columnIndex = i;
      break;
    }

    // Find the next set of columns where the item can fit.
    minHeight = Math.min(...columnsToCheck);
  }

  return columnIndex;
};
