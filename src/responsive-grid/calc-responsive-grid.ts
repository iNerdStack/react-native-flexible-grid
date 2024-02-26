import type { GridItem, TileItem } from './types';

export const calcResponsiveGrid = (
  data: TileItem[],
  maxItemsPerColumn: number,
  containerWidth: number,
  itemUnitHeight?: number
): {
  gridItems: GridItem[];
  gridViewHeight: number;
} => {
  const gridItems: GridItem[] = [];
  const itemSizeUnit = containerWidth / maxItemsPerColumn; // Determine TileSize based on container width and max number of columns
  let columnHeights: number[] = new Array(maxItemsPerColumn).fill(0); // Track the height of each column end.

  data.forEach((item) => {
    const widthRatio = item.widthRatio || 1;
    const heightRatio = item.heightRatio || 1;

    const itemWidth = widthRatio * itemSizeUnit;

    const itemHeight = itemUnitHeight
      ? itemUnitHeight * heightRatio
      : heightRatio * itemSizeUnit; // Use itemUnitHeight if provided, else fallback to itemSizeUnit

    // Find the column where the item should be placed.
    let columnIndex = findColumnForItem(
      columnHeights,
      widthRatio,
      maxItemsPerColumn
    );

    // Calculate item's top and left positions.
    const top = columnHeights[columnIndex]!;
    const left = columnIndex * itemSizeUnit;

    // Place the item.
    gridItems.push({
      ...item,
      top,
      left,
      width: itemWidth,
      height: itemHeight,
    });

    // Update the column heights for the columns that the item spans.
    // This needs to accommodate the actual height used (itemHeight).
    for (let i = columnIndex; i < columnIndex + widthRatio; i++) {
      columnHeights[i] = top + itemHeight; // Update to use itemHeight
    }
  });

  // Calculate the total height of the grid.
  const gridViewHeight = Math.max(...columnHeights);

  return {
    gridItems,
    gridViewHeight,
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
