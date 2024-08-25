import { useEffect, useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const TickGrid = ({ areaLayout, getLayout }) => {
	// const layout = props.layout;

	const generateDOM = useMemo(() => {
		return areaLayout.map((item) => {
			return (
				<div className="text-white bg-main cursor-pointer" key={item.i}>
					{item.i}
				</div>
			);
		});
	}, [areaLayout]);

	const onLayoutChange = (layout) => {
		getLayout(layout);
	};
	return (
		<GridLayout
			className="layout"
			onLayoutChange={onLayoutChange}
			layout={areaLayout}
			cols={120}
			rowHeight={1}
			width={1200}
		>
			{generateDOM}
		</GridLayout>
	);
};

export default TickGrid;
