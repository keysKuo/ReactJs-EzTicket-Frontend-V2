import { useEffect, useState, useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import axios from 'axios';

const TicketGraph = ({ areaId }) => {
	const [ticketMap, setTicketMap] = useState([]);

	const fetchTicketType = async () => {
		const options = {
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/search`,
			method: 'GET',
			params: {
				_id: areaId,
			},
		};

		await axios
			.request(options)
			.then((response) => {
				const result = response.data;

				if (result.success) {
					const ticket_types = result.ticket_types[0];
					console.log(ticket_types);
					setTicketMap(ticket_types.ticket_map);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const generateLayout = (ticketTypes) => {
		const areas = ticketTypes;
		const layout = [];
		for (const item of areas) {
			layout.push({
				i: item.name,
				x: item.x,
				y: item.y,
				w: item.w,
				h: item.h,
			});
		}
		return layout;
	};

	const areaLayout = generateLayout(ticketMap);

	useEffect(() => {
		fetchTicketType();
	}, []);

	const generateDOM = useMemo(() => {
		return areaLayout.map((item) => {
			return (
				<button className={`text-white cursor-pointe text-center `} key={item.name}>
					{item.name}
				</button>
			);
		});
	}, []);

	console.log(areaLayout);

	return (
		<GridLayout className="layout" layout={areaLayout} cols={180} rowHeight={1} width={1200}>
			{generateDOM}
		</GridLayout>
		// <>Hello</>
	);
};

export default TicketGraph;
