import { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const SeatGrid = ({
	ticketMaps,
	selectedTickets,
	setSelectedTickets,
	setFormData,
	formData,
	bookingTickets,
	setGroupTickets,
}) => {
	const { ticketMap, id, price, ticketName, w, h } = ticketMaps;
	let layout = [];
	const [pendingTickets, setPendingTickets] = useState([]);
	const [completedTickets, setCompletedTickets] = useState([]);

	const handleOnClick = (ticket) => {
		if (!selectedTickets.some((i) => i.ticketId == ticket._id))
			setSelectedTickets((prev) => [
				...prev,
				{
					_id: id,
					qty: 1,
					price,
					ticket_name: ticketName,
					name: ticket.i,
					x: ticket.x,
					y: ticket.y,
					ticketId: ticket._id,
				},
			]);
	};

	const handleDoubleClick = (ticket) => {
		setSelectedTickets((prev) => prev.filter((item) => item.name !== ticket.i));
	};

	useEffect(() => {
		const listPrice = selectedTickets.map((item) => item.price);
		setFormData({
			...formData,
			items: selectedTickets,
			temporary_cost: listPrice.reduce((total, price) => total + price, 0),
		});
		const group = groupByTicketTypes(selectedTickets);
		setGroupTickets(group);
	}, [selectedTickets]);

	useEffect(() => {
		bookingTickets.map((item) => {
			if (item.status == 'pending') {
				for (const ticket of item.tickets) setPendingTickets((prev) => [...prev, { x: ticket.x, y: ticket.y }]);
			}
		});

		bookingTickets.map((item) => {
			if (item.status == 'completed') {
				for (const ticket of item.tickets) setCompletedTickets((prev) => [...prev, { x: ticket.x, y: ticket.y }]);
			}
		});
	}, []);

	const generateDom = (ticketMap) => {
		return ticketMap.map((item) => {
			layout.push({
				...item,
				static: true,
			});
			return (
				<button
					disabled={
						completedTickets.some((i) => i.x == item.x && i.y == item.y) ||
						pendingTickets.some((i) => i.x == item.x && i.y == item.y)
					}
					onClick={() => {
						handleOnClick(item);
					}}
					onDoubleClick={() => handleDoubleClick(item)}
					className={`text-white rounded-md ${
						selectedTickets.some((i) => i.ticketId.includes(item._id))
							? 'bg-blue-600'
							: completedTickets.some((i) => i.x == item.x && i.y == item.y)
							? 'bg-red-500'
							: pendingTickets.some((i) => i.x == item.x && i.y == item.y)
							? 'bg-yellow-300'
							: 'bg-main'
					} cursor-pointe text-center`}
					key={item.i}
				>
					<strong>{ticketName}</strong>
					<br />
					{item.i}
				</button>
			);
		});
	};

	const groupByTicketTypes = (items) => {
		const grouped = items.reduce((acc, item) => {
			// Find the group object for the current item's ticket_name
			const group = acc.find((group) => group.ticket_name === item.ticket_name);

			if (group) {
				// If the group exists, push the item into its items array
				group.items.push(item);
			} else {
				// If the group doesn't exist, create a new group for this ticket_name
				acc.push({ ticket_name: item.ticket_name, items: [item] });
			}

			return acc;
		}, []);

		return grouped;
	};

	return (
		<GridLayout className="" layout={layout} cols={w} rowHeight={50} width={1200}>
			{generateDom(ticketMap)}
		</GridLayout>
	);
};

export default SeatGrid;
