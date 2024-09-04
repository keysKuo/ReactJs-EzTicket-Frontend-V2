import { useEffect, useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button, Modal, ListGroup } from 'flowbite-react';
import TicketGraph from '../Client/TicketGraph';

const AreaGraph = ({ ticketTypes, setData, data }) => {
	const [openModal, setOpenModal] = useState(false);

	const [areaId, setAreaId] = useState('');

	const generateLayout = (ticketTypes) => {
		const areas = ticketTypes;
		const layout = [];
		for (const item of areas) {
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
		return layout;
	};

	const handleOnClick = (item) => {
		setAreaId(item.id);
		console.log(areaId);
		setOpenModal(true);
	};

	const areaLayout = generateLayout(ticketTypes);
	
	const generateDOM = useMemo(() => {
		return areaLayout.map((item) => {
			return (
				<button
					onClick={() => handleOnClick(item)}
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
				</button>
			);
		});
	}, [areaLayout]);

	return (
		<div className="flex justify-between">
			<GridLayout className="layout" layout={areaLayout} cols={120} rowHeight={1} width={1200}>
				{generateDOM}
			</GridLayout>
			<div className="justify-center">
				<ListGroup className="w-48">
					<ListGroup.Item>VIP 1 - 1</ListGroup.Item>
					<ListGroup.Item>VIP 2 x 1</ListGroup.Item>
				</ListGroup>
			</div>
			<Modal size="7xl" show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>Chọn vé</Modal.Header>
				<Modal.Body>
					<TicketGraph areaId={areaId} />
				</Modal.Body>
				<Modal.Footer>
					<Button className="bg-main" onClick={() => setOpenModal(false)}>
						Xác nhận
					</Button>
					<Button color="gray" onClick={() => setOpenModal(false)}>
						Đóng
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default AreaGraph;
