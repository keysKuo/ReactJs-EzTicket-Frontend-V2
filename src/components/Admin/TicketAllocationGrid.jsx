import { useEffect, useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const TicketAllocationGrid = ({ ticketTypes, areas, onLayoutChange }) => {
	const generateLayout = (ticketTypes, areas) => {
		const layout = [];
		for (const item of ticketTypes) {
			const position = item.position;
			layout.push({
				i: `TicketType ${item._id}`,
				x: position.x,
				y: position.y,
				w: position.w,
				h: position.h,
				static: item.n_sold > 0,
			});
		}
		for (const item of areas) {
			const position = item.position;
			layout.push({
				i: `Area ${item._id}`,
				x: position.x,
				y: position.y,
				w: position.w,
				h: position.h,
				static: item.is_static,
			});
		}
		return layout;
	};

	const generateTicketTypeDom = (ticketTypes) => {
		return ticketTypes.map((item) => {
			return (
				<div className="text-white bg-main cursor-pointe text-center" key={`TicketType ${item._id}`}>
					{item.ticket_name}
				</div>
			);
		});
	};

	const generateAreaDom = (areas) => {
		return areas.map((item) => {
			return (
				<div className="text-white bg-gray-500 cursor-pointe text-center" key={`Area ${item._id}`}>
					{item.area_name}
				</div>
			);
		});
	};

	const layout = generateLayout(ticketTypes, areas);

	return (
		<GridLayout
			onLayoutChange={onLayoutChange}
			className="layout"
			layout={layout}
			cols={120}
			rowHeight={1}
			width={1200}
		>
			{generateAreaDom(areas)}
			{generateTicketTypeDom(ticketTypes)}
		</GridLayout>
	);
};

export default TicketAllocationGrid;
