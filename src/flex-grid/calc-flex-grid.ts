import type { FlexGridItem, FlexGridTile } from './types';

export const calcFlexGrid = (
  data: FlexGridTile[],
  maxColumnRatioUnits: number,
  itemSizeUnit: number
): {
  gridItems: FlexGridItem[];
  totalHeight: number;
  totalWidth: number;
} => {
  const gridItems: FlexGridItem[] = [];
  let columnHeights = new Array(maxColumnRatioUnits).fill(0); // Track the height of each column.

  data.forEach((item) => {
    const widthRatio = item.widthRatio || 1;
    const heightRatio = item.heightRatio || 1;

    // Find the column with the minimum height to start placing the current item.
    let columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    // If the item doesn't fit in the remaining columns, reset the row.
    if (widthRatio + columnIndex > maxColumnRatioUnits) {
      columnIndex = 0;
      const maxHeight = Math.max(...columnHeights);
      columnHeights.fill(maxHeight); // Align all columns to the height of the tallest column.
    }

    // Push the item with calculated position into the gridItems array.
    gridItems.push({
      ...item,
      top: columnHeights[columnIndex],
      left: columnIndex * itemSizeUnit,
    });

    // Update the heights of the columns spanned by this item.
    for (let i = columnIndex; i < columnIndex + widthRatio; i++) {
      columnHeights[i] += heightRatio * itemSizeUnit;
    }
  });

  // After positioning all data, calculate the total height of the grid.
  const totalHeight = Math.max(...columnHeights);

  // Return the positioned data and the total height of the grid.
  return {
    gridItems,
    totalHeight,
    totalWidth: maxColumnRatioUnits * itemSizeUnit,
  };
};
