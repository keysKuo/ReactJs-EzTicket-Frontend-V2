import { useEffect, useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const SeatAllocationGrid = ({ ticketMap, onLayoutTicketMapChange }) => {
	const { layout } = ticketMap;

	const generateDom = (layout) => {
		return layout.map((item) => {
			return (
				<div className="text-white bg-main cursor-pointe text-center" key={item.i}>
					{item.i}
				</div>
			);
		});
	};

	return (
		<GridLayout
			className="layout"
			onLayoutChange={onLayoutTicketMapChange}
			layout={layout}
			cols={20}
			rowHeight={20}
			width={1400}
		>
			{generateDom(layout)}
		</GridLayout>
	);
};

export default SeatAllocationGrid;
