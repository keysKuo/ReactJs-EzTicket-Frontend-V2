import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const TickGrid = () => {
	const layout = [
		{ i: 'a', x: 0, y: 0, w: 1, h: 2 },
		{ i: 'b', x: 1, y: 0, w: 3, h: 2 },
		{ i: 'c', x: 4, y: 0, w: 1, h: 2 },
		{ i: 'd', x: 6, y: 8, w: 1, h: 2 },
	];

	return (
		<GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
			<div className="text-white bg-black-500" key="a">
				a
			</div>
			<div className="text-white bg-black-500" key="b">
				b
			</div>
			<div className="text-white bg-black-500" key="c">
				c
			</div>
			<div className="text-white bg-black-500" key="d">
				d
			</div>
		</GridLayout>
	);
};

export default TickGrid;
