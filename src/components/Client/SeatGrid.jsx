import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const SeatGrid = ({ ticketMap }) => {
	let layout = [];
	const generateDom = (ticketMap) => {
		return ticketMap.map((item) => {
			layout.push({ ...item, static: true });
			return (
				<div className="text-white bg-main cursor-pointe text-center" key={item.i}>
					{item.i}
				</div>
			);
		});
	};

	return (
		<GridLayout className="layout" layout={layout} cols={20} rowHeight={20} width={1400}>
			{generateDom(ticketMap)}
		</GridLayout>
	);
};

export default SeatGrid;
