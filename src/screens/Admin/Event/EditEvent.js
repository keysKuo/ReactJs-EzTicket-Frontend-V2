import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner, TextInput, Modal, Button, Label } from 'flowbite-react';
import EditEventForm from '../../../components/Admin/EditEventForm';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
	HiCheck,
	HiExclamation,
	HiLockClosed,
	HiLockOpen,
	HiMinus,
	HiOutlineRefresh,
	HiPlus,
	HiTrash,
} from 'react-icons/hi';
const EditEvent = () => {
	const { eventId } = useParams();

	const [event, setEvent] = useState({});
	const [isLoadingEvent, setIsLoadingEvent] = useState(false);
	const [isLoadingArea, setIsLoadingArea] = useState(false);
	const [isLoadingType, setIsLoadingType] = useState(true);
	const [reload, setReload] = useState(false);

	const [formData, setFormData] = useState({
		event_name: '',
		category: '',
		occur_date: '',
		location: '',
		address: '',
		introduce: '',
		banner: '',
		status: '',
		is_seat_allocation: false,
		start_time: '',
		end_time: '',
	});
	const [categories, setCategories] = useState([]);
	const [areas, setAreas] = useState([]);
	const [ticketTypes, setTicketTypes] = useState([]);

	const [ticketTypeForm, setTicketTypeForm] = useState({
		event: eventId,
		ticket_name: '',
		price: '',
		n_stock: '',
		position: {
			x: '0',
			y: '0',
			w: '1',
			h: '1',
		},
	});

	// Modal
	const [openAddTypeModal, setOpenAddTypeModal] = useState(false);
	const [openAllocationModal, setOpenAllocationModal] = useState(false);

	// Fetch
	const fetchEvent = async (eventId) => {
		setIsLoadingEvent(true);
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/event/detail/${eventId}`,
		};

		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				if (result.success) {
					setEvent(result.event);
					setFormData({
						event_name: result.event.event_name,
						category: result.event.category._id,
						occur_date: result.event.occur_date,
						time: result.event.time,
						location: result.event.location,
						address: result.event.address,
						introduce: result.event.introduce,
						banner: result.event.banner,
						status: result.event.status,
						is_seat_allocation: result.event.is_seat_allocation,
						start_time: result.event.start_time,
						end_time: result.event.end_time,
					});
				}
				setIsLoadingEvent(false);
			})
			.catch((err) => {
				toast.error(err.message);
				console.log(err);
			});
	};
	const fetchDataCategories = async () => {
		setIsLoadingEvent(true);
		await axios
			.get(`${process.env.REACT_APP_API_URL}/api/category/all`)
			.then((response) => {
				const result = response.data;

				if (result.success) {
					setCategories(result.categories);
				}
				setIsLoadingEvent(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchArea = async (eventId) => {
		setIsLoadingArea(true);
		await axios
			.get(`${process.env.REACT_APP_API_URL}/api/area/event/${eventId}`)
			.then((response) => {
				const result = response.areas;
				if (result.success) {
					setCategories(result.categories);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		setIsLoadingArea(false);
	};

	const fetchTicketType = async (eventId) => {
		setIsLoadingType(true);
		await axios
			.get(`${process.env.REACT_APP_API_URL}/api/ticket_type/search/?event=${eventId}`)
			.then((response) => {
				const data = response.data;
				if (data.success) {
					setTicketTypes(data.ticket_types);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		setIsLoadingType(false);
	};

	const firstLoading = async (eventId) => {
		await fetchDataCategories();
		await fetchEvent(eventId);
		await fetchTicketType(eventId);
	};

	useEffect(() => {
		firstLoading(eventId);
	}, [reload]);

	const UpdateEvent = async (eventId, formData) => {
		const options = {
			method: 'PUT',
			url: `${process.env.REACT_APP_API_URL}/api/event/update/${eventId}`,
			headers: {
				'Content-Type': 'application/json',
			},
			params: {},
			data: JSON.stringify(formData),
		};

		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				if (result.success) {
					toast.success('Cập nhật sự kiện thành công');
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
	};

	const AddTicketType = async (ticketTypeForm) => {
		const options = {
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/create`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify(ticketTypeForm),
		};

		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				if (result.success) {
					toast.success('Thêm vé thành công');
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
			})
			.finally(() => {
				setTicketTypeForm({
					ticket_name: '',
					price: '',
					n_stock: '',
					position: {
						x: '0',
						y: '0',
						w: '1',
						h: '1',
					},
					event: eventId,
				});
			});
	};

	// Handle onClick

	const handleSubmit = async () => {
		UpdateEvent(eventId, formData);
		await fetchDataCategories();
		await fetchEvent(eventId);
	};
	const handleAddTicketType = async () => {
		console.log(ticketTypeForm);
		await AddTicketType(ticketTypeForm);
		await fetchTicketType(eventId);
		setOpenAddTypeModal(false);
	};
	const handleUpdateTicketType = async (typeId, isSelling) => {
		setIsLoadingType(true);
		const options = {
			method: 'PUT',
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/update/${typeId}`,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({ is_selling: isSelling }),
		};
		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				if (result.success) {
					toast.success(result.msg);
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
		await fetchTicketType(eventId);
		setIsLoadingType(false);
	};
	const handleDeleteTicketType = async (typeId) => {
		setIsLoadingType(true);
		const options = {
			method: 'DELETE',
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/delete/${typeId}`,
		};
		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				if (result.success) {
					toast.success(result.msg);
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
		await fetchTicketType(eventId);
		setIsLoadingType(false);
	};

	return (
		<section className="px-6 py-4 mt-[-10px] bg-gray-100">
			<div className="flex items-center justify-between mb-10">
				<div className="grow">
					<div className="relative pt-2">
						<h1 className="text-2xl whitespace-nowrap text-black-500">Cập nhật sự kiện</h1>
					</div>
					<p className="whitespace-nowrap overflow-hidden text-xs text-gray-400 ">API ID: 315F4</p>
				</div>
				<div className="pt-4 flex flex-row gap-3">
					<button
						onClick={() => {
							setIsEditing(false);
						}}
						className="bg-gray-200 text-sm min-w-32 px-4 py-1"
					>
						Trở lại
					</button>
					<button
						onClick={async () => {
							await handleSubmit();
							setReload(!reload);
						}}
						className="text-sm bg-main min-w-32 px-4 py-1"
					>
						{isLoadingEvent ? <Spinner color="success" aria-label="Success spinner example" /> : 'Lưu'}
					</button>
				</div>
			</div>
			{isLoadingEvent ? (
				<div className="text-center">
					<Spinner aria-label="Extra large spinner example" size="xl" />
				</div>
			) : !event ? (
				<div>Not found</div>
			) : (
				<div>
					<img className="w-full mb-4" src={event.banner} />
					<div className="grid grid-cols-4 gap-10">
						<div className="col-span-3 bg-gray-50 border border-gray-300 p-5 rounded">
							<div className="grid grid-cols-2 gap-5">
								<EditEventForm data={formData} setData={setFormData} categories={categories} />
							</div>
						</div>

						<div className="col-span-1">
							{/* Ticket Type */}
							<div className="w-full bg-gray-50 rounded border border-gray-200">
								<div className="py-4 px-6 flex flex-row items-center justify-between">
									<label className="text-sm font-medium text-black-500">Danh sách vé</label>
									<Button onClick={() => setOpenAddTypeModal(true)} className="text-main">
										<HiPlus className="cursor-pointer text-white" />
									</Button>
								</div>
								<div className="">
									{isLoadingType ? (
										<div className="text-center">
											<Spinner aria-label="Extra large spinner example" size="xl" />
										</div>
									) : (
										<table className="text-xs leading-10 w-full bg-gray-100">
											<thead>
												<tr className="text-center text-black-500">
													<th>Loại vé</th>
													<th>Giá</th>
													<th>Đã bán</th>
													<th>Còn lại</th>
													<th>
														<div className="px-2"></div>
													</th>
												</tr>
											</thead>

											<tbody className="text-black-500 text-center">
												{ticketTypes.map((item, key) => (
													<tr key={key}>
														<td>{item.ticket_name}</td>
														<td>{item.price.toLocaleString('vi-vn')}đ</td>
														<td>{item.n_sold}</td>
														<td>{item.n_stock}</td>
														<td className="text-sm space-x-1">
															{formData['is_seat_allocation'] && (
																<HiPlus className="inline cursor-pointer text-main" />
															)}
															{!item.is_selling ? (
																<HiLockClosed
																	onClick={async () => {
																		await handleUpdateTicketType(item._id, true);
																	}}
																	className="inline cursor-pointer text-red-500"
																/>
															) : (
																<HiLockOpen
																	onClick={async () => {
																		await handleUpdateTicketType(item._id, false);
																	}}
																	className="inline cursor-pointer text-main"
																/>
															)}
															<HiTrash
																onClick={async () => {
																	if (item.n_sold !== 0) {
																		toast.warning('Vé đã được bán, không thể xóa');
																	}
																	await handleDeleteTicketType(item._id);
																}}
																className="inline cursor-pointer text-red-500"
															/>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</div>
							</div>
							<Modal show={openAddTypeModal} onClose={() => setOpenAddTypeModal(false)}>
								<Modal.Header>Thêm loại vé</Modal.Header>
								<Modal.Body>
									<div className="grid grid-cols-2 gap-4">
										<div className="col-span-1">
											<div className="max-w-md">
												<div className="mb-2 block">
													<Label htmlFor="ticket_type_name" value="Tên vé" />
												</div>
												<TextInput
													onChange={(e) =>
														setTicketTypeForm({ ...ticketTypeForm, ticket_name: e.target.value })
													}
													value={ticketTypeForm['ticket_name']}
													id="ticket_type_name"
													type="text"
													placeholder="Tên vé"
													required
												/>
											</div>
										</div>
										<div className="col-span-1">
											<div className="max-w-md">
												<div className="mb-2 block">
													<Label htmlFor="ticket_type_price" value="Giá vé" />
												</div>
												<TextInput
													onChange={(e) => setTicketTypeForm({ ...ticketTypeForm, price: e.target.value })}
													value={ticketTypeForm['price']}
													id="ticket_type_price"
													type="text"
													placeholder="Giá vé"
													required
												/>
											</div>
										</div>
										<div className="col-span-1">
											<div className="max-w-md">
												<div className="mb-2 block">
													<Label htmlFor="ticket_type_num" value="số lương" />
												</div>
												<TextInput
													onChange={(e) =>
														setTicketTypeForm({ ...ticketTypeForm, n_stock: e.target.value })
													}
													value={ticketTypeForm['n_stock']}
													id="ticket_type_num"
													type="text"
													placeholder="số lương"
													required
												/>
											</div>
										</div>
										{formData['is_seat_allocation'] && (
											<div className="col-span-1">
												<div className="grid grid-cols-2 gap-4">
													<div className="col-span-1">
														<div className="max-w-md">
															<div className="mb-2 block">
																<Label htmlFor="ticket_type_width" value="Chiều rộng" />
															</div>
															<TextInput
																value={ticketTypeForm['position'].w}
																onChange={(e) =>
																	setTicketTypeForm({
																		...ticketTypeForm,
																		position: { ...ticketTypeForm.position, w: e.target.value },
																	})
																}
																id="ticket_type_width"
																type="text"
																placeholder="Chiều rộng"
																required
															/>
														</div>
													</div>
													<div className="col-span-1">
														<div className="max-w-md">
															<div className="mb-2 block">
																<Label htmlFor="ticket_type_height" value="Chiều dài" />
															</div>
															<TextInput
																value={ticketTypeForm['position'].h}
																onChange={(e) =>
																	setTicketTypeForm({
																		...ticketTypeForm,
																		position: { ...ticketTypeForm.position, h: e.target.value },
																	})
																}
																id="ticket_type_height"
																type="text"
																placeholder="Chiều dài"
																required
															/>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={() => handleAddTicketType()}>Thêm</Button>
									<Button color="gray" onClick={() => setOpenAddTypeModal(false)}>
										Hủy bỏ
									</Button>
								</Modal.Footer>
							</Modal>

							{/* Area */}
							<div className="w-full bg-gray-50 rounded border border-gray-200 mt-10">
								<div className="py-4 px-6 flex flex-row items-center justify-between">
									<label className="text-sm font-medium text-black-500">Danh khu vực</label>
								</div>
								<div className="">
									{isLoadingArea ? (
										<div className="text-center">
											<Spinner aria-label="Extra large spinner example" size="xl" />
										</div>
									) : (
										<table className="text-xs leading-10 w-full bg-gray-100">
											<thead>
												<tr className="text-center text-black-500">
													<th>Loại vé</th>
													<th>Giá</th>
													<th>Đã bán</th>
													<th>Còn lại</th>
													<th>
														<div className="px-2"></div>
													</th>
												</tr>
											</thead>

											<tbody className="text-black-500 text-center">
												{/* {ticketTypes.map((item,key) => (
													<td key={key} className="text-sm space-x-1">{item.ticket_name}</td>
												))} */}
												<tr>
													<td className="text-sm space-x-1">1</td>
													<td className="text-sm space-x-1">1</td>
													<td className="text-sm space-x-1">1</td>
													<td className="text-sm space-x-1">1</td>
												</tr>
											</tbody>
										</table>
									)}
								</div>
							</div>

							{formData['is_seat_allocation'] && (
								<>
									<div className="mt-10 w-full">
										<Button onClick={() => setOpenAllocationModal(true)} className="bg-main">
											Bố trí
										</Button>
									</div>
									<Modal show={openAllocationModal} onClose={() => setOpenAllocationModal(false)}>
										<Modal.Header>Bố trí chỗ ngồi</Modal.Header>
										<Modal.Body>Bố trí chỗ ngồi</Modal.Body>
										<Modal.Footer>Bố trí chỗ ngồi</Modal.Footer>
									</Modal>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default EditEvent;
