import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';

const RectangleGrid = ({ numSquares, containerWidth, containerHeight }) => {
  const [layout, setLayout] = useState([]);
  const [gridWidth, setGridWidth] = useState(containerWidth);
  const [gridHeight, setGridHeight] = useState(containerHeight);

  useEffect(() => {
    // Calculate number of rows and columns
    const cols = Math.ceil(Math.sqrt(numSquares));
    const rows = Math.ceil(numSquares / cols);

    // Update grid dimensions
    setGridWidth(cols * 1); // Assuming each box is 1x1
    setGridHeight(rows * 1); // Assuming each box is 1x1

    // Update layout
    const newLayout = [];
    for (let i = 0; i < numSquares; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      newLayout.push({
        i: i.toString(),
        x: col,
        y: row,
        w: 1,
        h: 1,
      });
    }
    setLayout(newLayout);
  }, [numSquares]);

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={Math.ceil(gridWidth)} // Number of columns
      rowHeight={1} // Height of each row
      width={gridWidth}
      height={gridHeight}
    >
      {Array.from({ length: numSquares }).map((_, index) => (
        <div key={index} className="grid-item">
          {index + 1}
        </div>
      ))}
    </GridLayout>
  );
};

export default RectangleGrid;
