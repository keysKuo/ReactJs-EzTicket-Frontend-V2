import { useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const AreaGraph = ({ ticketTypes, areas }) => {
	const generateLayout = (ticketTypes, areas) => {
		const layout = [];
		for (const item of ticketTypes) {
			const position = item.position;
			layout.push({
				i: item.ticket_name,
				x: position.x,
				y: position.y,
				w: position.w,
				h: position.h,
				static: true,
				id: item._id,
				is_area: item.is_area,
				n_stock: item.n_stock,
			});
		}
		for (const item of areas) {
			const position = item.position;
			layout.push({
				i: item.area_name,
				x: position.x,
				y: position.y,
				w: position.w,
				h: position.h,
				static: true,
				is_area: true,
			});
		}
		return layout;
	};

	const areaLayout = generateLayout(ticketTypes, areas);

	const generateDOM = useMemo(() => {
		return areaLayout.map((item) => {
			return (
				<div
					className={`text-white cursor-pointe text-center ${item.is_area ? 'bg-slate-400' : 'bg-main'}`}
					key={item.i}
					disabled={item.is_area}
				>
					{item.i} <br></br>{' '}
					{!item.is_area && (
						<>
							Còn lại <strong>{item.n_stock}</strong>
						</>
					)}
				</div>
			);
		});
	}, [areaLayout]);

	return (
		<div className="flex justify-between">
			<GridLayout className="layout" layout={areaLayout} cols={120} rowHeight={1} width={1200}>
				{generateDOM}
			</GridLayout>
		</div>
	);
};

export default AreaGraph;
