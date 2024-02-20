import type { CellItemData, GridItem } from './types';

export const calcCellGrid = (
  data: CellItemData[],
  maxWidthRatio: number,
  cellSize: number
): {
  gridItems: GridItem[];
  totalHeight: number;
  totalWidth: number;
} => {
  const gridItems: GridItem[] = [];
  let columnHeights = new Array(maxWidthRatio).fill(0); // Track the height of each column.

  data.forEach((item) => {
    // Find the column with the minimum height to start placing the current item.
    let columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    // If the item doesn't fit in the remaining columns, reset the row.
    if (item.widthRatio + columnIndex > maxWidthRatio) {
      columnIndex = 0;
      const maxHeight = Math.max(...columnHeights);
      columnHeights.fill(maxHeight); // Align all columns to the height of the tallest column.
    }

    // Push the item with calculated position into the gridItems array.
    gridItems.push({
      ...item,
      top: columnHeights[columnIndex],
      left: columnIndex * cellSize,
    });

    // Update the heights of the columns spanned by this item.
    for (let i = columnIndex; i < columnIndex + item.widthRatio; i++) {
      columnHeights[i] += item.heightRatio * cellSize;
    }
  });

  // After positioning all data, calculate the total height of the grid.
  const totalHeight = Math.max(...columnHeights);

  // Return the positioned data and the total height of the grid.
  return { gridItems, totalHeight, totalWidth: maxWidthRatio * cellSize };
};
