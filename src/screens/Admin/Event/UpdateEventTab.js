import { useEffect, useMemo, useState } from 'react';
import EditForm from '../../../components/Form/EditForm';
import AddArea from '../../../components/Admin/AddArea';
import TickGrid from '../../../components/Admin/TicketGrid';
import axios from 'axios';
import { Spinner, Toast, Modal, Button, ToggleSwitch } from 'flowbite-react';
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
import Input from '../../../components/Form/Input';
export default function UpdateEventTab({ event_id, setIsEditing }) {
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Fetch Event, Categories data
	const [event, setEvent] = useState(null);
	const [ticketTypes, setTicketType] = useState(null);
	const [categories, setCategories] = useState([]);
	const [isAllocation, setIsAllocation] = useState(false);

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/event/detail/${event_id}`,
		};

		const fetchDataEvent = async () => {
			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setEvent(result.event);
						setTicketType(result.event.ticket_types);
						setIsAllocation(result.event.is_seat_allocation);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const fetchDataCategories = async () => {
			await axios
				.get(`${process.env.REACT_APP_API_URL}/api/category/all`)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setCategories(result.categories);
					}

					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchDataEvent();
		fetchDataCategories();
	}, []);

	// Listen Event Change
	useEffect(() => {
		if (event) {
			fetchTicketType(event._id);
			setAddTicketForm({ ...addTicketForm, event: event._id });
			setFormData({
				event_name: event.event_name,
				category: event.category._id,
				occur_date: event.occur_date,
				time: event.time,
				location: event.location,
				address: event.address,
				introduce: event.introduce,
				banner: event.banner,
				status: event.status,
				is_seat_allocation: isAllocation,
			});
			console.log(formData);
		}
	}, [event]);

	const updateEvent = (key, val) => {
		let updatedEvent = { ...event };
		updateEvent[key] = val;
		setEvent(updatedEvent);
	};

	// Submit update
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [formData, setFormData] = useState({});

	const handleSubmit = () => {
		setIsSubmiting(true);
		var formDataToSend = new FormData();
		for (let key in formData) {
			if (formData.hasOwnProperty(key)) {
				formDataToSend.append(key, formData[key]);
			}
		}

		formDataToSend.append(
			'ticket_types',
			JSON.stringify(
				event['ticket_types'].map((type) => {
					return {
						_id: type._id,
						ticket_name: type.ticket_name,
						price: type.price,
						n_stock: type.n_stock,
						is_selling: type.is_selling,
						add_qty: type.add_qty || 0,
						is_delete: type.is_delete || false,
					};
				}),
			),
		);

		// console.log(formData);

		const UpdateEvent = async () => {
			const options = {
				method: 'PUT',
				url: `${process.env.REACT_APP_API_URL}/api/event/update/${event_id}`,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				params: {},
				data: formDataToSend,
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setTimeout(() => {
							setSuccessMessage('Cập nhật sự kiện thành công');
						}, 2000);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setTimeout(() => {
						setIsSubmiting(false);
					}, 2000);
				});
		};

		UpdateEvent();
	};

	// Add Ticket Type
	const [isAddingTicket, setIsAddingTicket] = useState(false);

	const [addTicketForm, setAddTicketForm] = useState({
		ticket_name: '',
		price: '',
		n_stock: '',
		event: '',
		position: {
			x: '',
			y: '',
			w: '',
			h: '',
		},
	});

	const handleAddTicket = () => {
		if (!addTicketForm['ticket_name'] || !addTicketForm['price'] || !addTicketForm['n_stock']) {
			setErrorMessage('Vui lòng điền đầy đủ thông tin vé');
			return;
		}

		if (!addTicketForm['n_stock'] || addTicketForm['n_stock'] < 0) {
			setErrorMessage('Số lượng không hợp lệ');
			return;
		}

		const createTicketType = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/ticket_type/create`,
				method: 'POST',
				params: {},
				data: addTicketForm,
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						if (result.is_addQty) {
							let updatedEvent = { ...event };
							updatedEvent.ticket_types = updatedEvent.ticket_types.map((type) => {
								if (type.ticket_name === result.ticket_type.ticket_name) {
									return {
										...type,
										price: result.ticket_type.price,
										n_stock: result.ticket_type.n_stock,
									};
								}

								return { ...type };
							});
							setEvent(updatedEvent);
						} else {
							let updatedEvent = { ...event };
							updatedEvent.ticket_types.push({ ...addTicketForm, n_sold: 0 });
							setEvent(updatedEvent);
						}
					}

					setErrorMessage('');
				})
				.catch((err) => {
					console.log(err);
					setErrorMessage('Xãy ra sự cố vui lòng thử lại sau ít phút.');
				})
				.finally(() => {
					setAddTicketForm({
						ticket_name: '',
						price: '',
						n_stock: '',
						position: {
							x: '',
							y: '',
							w: '',
							h: '',
						},
						event: event._id,
					});

					setIsAddingTicket(false);
				});
		};

		createTicketType();
	};

	// Handle area management
	const [areaLayout, setAreaLayout] = useState([]);
	// Add area
	const [isAddingArea, setIsAddingArea] = useState(false);

	// Setup seat booking
	const [openSeatModal, setOpenSeatModal] = useState(false);
	const [openAddArea, setOpenAddArea] = useState(false);

	const [isLoadingLayout, setIsLoadingLayout] = useState(false);

	const fetchTicketType = async (id) => {
		setIsLoadingLayout(true);
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/search/`,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			params: {
				event: id,
			},
		};
		await axios
			.request(options)
			.then((response) => {
				const result = response.data;

				if (result.success) {
					setTicketType(result.ticket_types);
				}
				setIsLoadingLayout(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

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
			});
		}
		return layout;
	};

	function calculateRoomDimensions(chairs) {
		const sqrt = Math.sqrt(chairs);
		let width = Math.ceil(sqrt);
		let height = Math.ceil(sqrt);
		if (width * height < chairs) {
			height = Math.ceil(chairs / width);
		}
		const factor = 1;
		width /= factor;
		height /= factor;
		return { width, height };
	}

	const handleOnClickAreaMgmt = async () => {
		await fetchTicketType(event._id);
		const layout = generateLayout(ticketTypes);
		setAreaLayout(layout);
		setOpenSeatModal(true);
	};

	const [updateLayout, setUpdateLayout] = useState();

	const updateTicketType = async (id, data) => {
		const options = {
			method: 'PUT',
			url: `${process.env.REACT_APP_API_URL}/api/ticket_type/update/${id}`,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({ position: data }),
		};

		await axios
			.request(options)
			.then((response) => {
				const result = response.data;
				console.log(result);
				if (result.success) {
					setSuccessMessage('Cập nhật sự kiện thành công');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleSaveLayout = async () => {
		try {
			event.ticket_types.map(async (item, index) => {
				const position = {
					x: updateLayout[index].x,
					y: updateLayout[index].y,
					h: updateLayout[index].h,
					w: updateLayout[index].w,
				};
				setIsLoadingLayout(true);
				await updateTicketType(item._id, position);
				setIsLoadingLayout(false);
			});
		} catch (error) {
			console.log(error);
		} finally {
			handleSubmit();
			await fetchTicketType(event._id);
			const layout = generateLayout(ticketTypes);
			setAreaLayout(layout);
			setOpenSeatModal(false);
		}
	};

	const getLayout = (layout) => {
		setUpdateLayout(layout);
	};

	const handleProveEvent = (event_id, is_approved) => {
		const ProveEvent = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/event/update-type/${event_id}`,
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				params: {
					is_seat_allocation: is_approved,
				},
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setTimeout(() => {
							setSuccessMessage('Cập nhật sự kiện thành công');
						}, 2000);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setTimeout(() => {
						setIsSubmiting(false);
					}, 2000);
				});
		};
		console.log(event_id, is_approved);
		ProveEvent();
	};

	return (
		<>
			<section className="px-6 py-4 mt-[-10px]">
				<div className="flex items-center justify-between mb-10">
					<div className="grow">
						<div className="relative pt-2">
							<h1 className="text-2xl whitespace-nowrap">Cập nhật sự kiện</h1>
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
							onClick={() => {
								handleSubmit();
							}}
							className="text-sm 	 min-w-32 px-4 py-1"
						>
							{isSubmiting ? <Spinner color="success" aria-label="Success spinner example" /> : 'Lưu'}
						</button>
					</div>
				</div>
				{event && (
					<>
						<img className="w-full mb-4" src={event.banner} />
						<div className="grid grid-cols-4 gap-10">
							<div className="col-span-3 bg-gray-50 border border-gray-300 p-5 rounded">
								<div className="grid grid-cols-2 gap-5">
									<EditForm inputs={inputs} data={formData} setData={setFormData} categories={categories} />
								</div>
							</div>

							<div className="col-span-1">
								<div className="w-full bg-gray-50 rounded border border-gray-200">
									<div className="py-4 px-6 flex flex-row items-center justify-between">
										<label className="text-sm font-medium">Danh sách vé</label>
										<p
											onClick={() => {
												setIsAddingTicket((prev) => (prev = !prev));
											}}
										>
											{isAddingTicket ? (
												<HiMinus className="cursor-pointer" />
											) : (
												<HiPlus className="cursor-pointer" />
											)}
										</p>
									</div>

									<div className="">
										<table className="text-xs leading-10 w-full bg-gray-100">
											<tr className="text-center">
												<th>Loại vé</th>
												<th>Giá</th>
												<th>Đã bán</th>
												<th>Còn lại</th>
												<th>
													<div className="px-2"></div>
												</th>
											</tr>
											{event.ticket_types.map((type, idx) => {
												if (!type.is_area)
													return (
														<tr key={idx} className={`text-center ${type.is_delete && 'line-through'}`}>
															<td>{type.ticket_name}</td>
															<td>{type.price.toLocaleString('vi-vn')}đ</td>
															<td>{type.n_sold}</td>
															<td>{type.n_stock}</td>
															<td className="text-sm space-x-1">
																{type.is_delete ? (
																	<HiOutlineRefresh
																		className="inline cursor-pointer text-blue-400"
																		onClick={() => {
																			let updatedTypes = [...event['ticket_types']];
																			updatedTypes[idx].is_delete = false;
																			updateEvent('ticket_types', updatedTypes);
																		}}
																	/>
																) : (
																	<>
																		{isAllocation && (
																			<HiPlus
																				onClick={() => setOpenSeatModal(true)}
																				className="inline cursor-pointer text-main"
																			/>
																		)}

																		{!type.is_selling ? (
																			<HiLockClosed
																				onClick={() => {
																					let updatedTypes = [...event['ticket_types']];
																					updatedTypes[idx].is_selling = true;
																					updateEvent('ticket_types', updatedTypes);
																				}}
																				className="inline cursor-pointer text-red-500"
																			/>
																		) : (
																			<HiLockOpen
																				onClick={() => {
																					let updatedTypes = [...event['ticket_types']];
																					updatedTypes[idx].is_selling = false;
																					updateEvent('ticket_types', updatedTypes);
																				}}
																				className="inline cursor-pointer text-emerald-300"
																			/>
																		)}
																		<HiTrash
																			onClick={() => {
																				if (type.n_sold !== 0) {
																					setErrorMessage('Vé bán rồi không thể xóa');
																					return;
																				}
																				let updatedTypes = [...event['ticket_types']];
																				updatedTypes[idx].is_delete = true;
																				updateEvent('ticket_types', updatedTypes);
																			}}
																			className="inline cursor-pointer text-blue-400"
																		/>
																	</>
																)}
															</td>
														</tr>
													);
											})}
										</table>
									</div>

									<div className={`${isAddingTicket ? 'grid' : 'hidden'} grid-cols-4 gap-5 p-4`}>
										<div className="col-span-2">
											<div className="relative bg-gray-200 rounded">
												<Input
													placeholder="Tên vé"
													onChange={(e) => {
														setAddTicketForm({
															...addTicketForm,
															ticket_name: e.target.value,
														});
													}}
													value={addTicketForm['ticket_name']}
													type="text"
												/>
											</div>
										</div>

										<div className="col-span-2">
											<div className="relative bg-gray-200 rounded">
												<Input
													placeholder="Giá vé"
													onChange={(e) => {
														setAddTicketForm({
															...addTicketForm,
															price: parseInt(e.target.value),
														});
													}}
													value={addTicketForm['price']}
													type="number"
												/>
											</div>
										</div>
										<div className="col-span-2">
											<div className="relative bg-gray-200 rounded">
												<Input
													placeholder="Số lượng"
													onChange={(e) => {
														setAddTicketForm({
															...addTicketForm,
															n_stock: parseInt(e.target.value),
															position: {
																x: 0,
																y: 0,
																w: calculateRoomDimensions(parseInt(e.target.value)).width,
																h: calculateRoomDimensions(parseInt(e.target.value)).height,
															},
														});
													}}
													value={addTicketForm['n_stock']}
													type="number"
												/>
											</div>
										</div>

										<div className="col-span-2 text-center">
											<button onClick={handleAddTicket} className="btn">
												Tạo loại vé
											</button>
										</div>
									</div>
								</div>

								<div className="w-full mt-8 mb-2 py-4 flex justify-around bg-gray-50 rounded border  border-gray-200">
									<label className="text-sm font-medium">Phân bổ chỗ ngồi</label>
									<ToggleSwitch
										checked={isAllocation}
										onChange={() => {
											setIsAllocation(!isAllocation);
											handleProveEvent(event._id, !isAllocation);
											handleSubmit();
										}}
									/>
								</div>

								{isAllocation && (
									<div className="w-full bg-gray-50 rounded border  border-gray-200">
										<div className="py-4 px-6 flex flex-row items-center justify-between">
											<label className="text-sm font-medium">Danh sách khu vực</label>
											<p
												onClick={() => {
													setIsAddingArea((prev) => (prev = !prev));
												}}
											>
												{isAddingArea ? (
													<HiMinus className="cursor-pointer" />
												) : (
													<HiPlus className="cursor-pointer" />
												)}
											</p>
										</div>

										<div className="">
											<table className="text-xs leading-10 w-full bg-gray-100">
												<tr className="text-center">
													<th>Tên</th>

													<th>
														<div className="px-2"></div>
													</th>
												</tr>
												{event.ticket_types.map((type, idx) => {
													if (type.is_area)
														return (
															<tr
																key={idx}
																className={`text-center ${type.is_delete && 'line-through'}`}
															>
																<td>{type.ticket_name}</td>
																<td className="text-sm space-x-1">
																	<HiTrash
																		onClick={() => {
																			let updatedTypes = [...event['ticket_types']];
																			updatedTypes[idx].is_delete = true;
																			updateEvent('ticket_types', updatedTypes);
																		}}
																		className="inline cursor-pointer text-blue-400"
																	/>
																</td>
															</tr>
														);
												})}
											</table>
										</div>

										<Modal show={openSeatModal} size="7xl" onClose={() => setOpenSeatModal(false)}>
											<Modal.Header>Bố trí khu vực vé</Modal.Header>
											<Modal.Body>
												{isLoadingLayout ? (
													<div className="text-center">
														<Spinner aria-label="Center-aligned spinner example" />
													</div>
												) : (
													<div className="space-y-6 p-6">
														<div className="mx-auto bg-gray-100">
															<TickGrid getLayout={getLayout} areaLayout={areaLayout} />
														</div>
													</div>
												)}
												<AddArea openAddArea={openAddArea} setOpenAddArea={() => setOpenAddArea()} />
											</Modal.Body>
											<Modal.Footer>
												<Button className="bg-main" onClick={handleSaveLayout}>
													Lưu
												</Button>
												<Button color="gray" onClick={() => setOpenSeatModal(false)}>
													Hủy bỏ
												</Button>
											</Modal.Footer>
										</Modal>

										<div className={`${isAddingArea ? 'grid' : 'hidden'} grid-cols-4 gap-5 p-4`}>
											<div className="col-span-2">
												<div className="relative bg-gray-200 rounded">
													<Input
														placeholder="Tên khu vực"
														onChange={(e) => {
															setAddTicketForm({
																...addTicketForm,
																ticket_name: e.target.value,
																is_area: true,
																price: 1,
																n_stock: 1,
															});
														}}
														value={addTicketForm['ticket_name']}
														type="text"
													/>
												</div>
											</div>
											<div className="col-span-2">
												<div className="relative bg-gray-200 rounded">
													<Input
														placeholder="Chiều dài"
														onChange={(e) => {
															setAddTicketForm({
																...addTicketForm,
																position: {
																	...addTicketForm.position,
																	h: parseInt(e.target.value),
																},
															});
														}}
														value={addTicketForm['position'].h}
														type="text"
													/>
												</div>
											</div>
											<div className="col-span-2">
												<div className="relative bg-gray-200 rounded">
													<Input
														placeholder="Chiều rộng"
														onChange={(e) => {
															setAddTicketForm({
																...addTicketForm,
																position: {
																	...addTicketForm.position,
																	w: parseInt(e.target.value),
																},
															});
														}}
														value={addTicketForm['position'].w}
														type="text"
													/>
												</div>
											</div>
											<div className="col-span-2 text-center">
												<button onClick={handleAddTicket} className="btn">
													Tạo khu vực
												</button>
											</div>
										</div>
									</div>
								)}

								{isAllocation && (
									<div className="w-full my-5">
										<Button onClick={handleOnClickAreaMgmt} className="bg-main">
											Bố trí khu vực
										</Button>
									</div>
								)}
							</div>

							{/* {editstate && (
                                <div className="col-span-1">
                                    <div className="w-full bg-gray-50 rounded border border-gray-200">
                                        <div className="p-4">
                                            <p className="text-xs">Thông tin cập nhật</p>
                                            <div className="pt-5">
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-xs text-gray-400 text-uppercase">
                                                        Cập nhật lần cuối
                                                    </p>
                                                    <p className="text-xs text-gray-400 text-uppercase">
                                                        2 tháng trước
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-5">
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-xs text-gray-400 text-uppercase">
                                                        Người cập nhật
                                                    </p>
                                                    <p className="text-xs text-gray-400 text-uppercase">admin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full my-3 bg-emerald-50 flex items-center border border-gray-200">
                                        <div className="p-2 flex flex-row gap-2">
                                            <HiCheck color="#76BA99" />
                                            <p className="text-xs text-main font-medium">
                                                Thông tin tổ chức đã được cập nhật
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-50 rounded border border-gray-200">
                                        <ul>
                                            <li className="cursor-pointer hover:bg-gray-100 px-5 py-1 border-b border-gray-200">
                                                <div className="flex flex-row items-center h-8 gap-2">
                                                    <HiCode />
                                                    <p className="text-xs">Chỉnh sửa giao diện</p>
                                                </div>
                                            </li>
                                            <li className="cursor-pointer hover:bg-gray-100 px-5 py-1 border-b border-gray-200">
                                                <div className="flex flex-row items-center h-8 gap-2">
                                                    <HiCog />
                                                    <p className="text-xs">Thay đổi các mục</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )} */}
						</div>
					</>
				)}
			</section>
			<div className={`fixed right-3 bottom-5 ${errorMessage !== '' ? 'block' : 'hidden'}`}>
				<Toast>
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
						<HiExclamation className="h-5 w-5" />
					</div>
					<div className="ml-3 text-xs font-normal">{errorMessage}</div>
					{/* <Toast.Toggle /> */}
				</Toast>
			</div>
			<div className={`fixed right-3 bottom-5 ${successMessage !== '' ? 'block' : 'hidden'}`}>
				<Toast>
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-400 dark:bg-emerald-700 dark:text-emerald-200">
						<HiCheck className="h-5 w-5" />
					</div>
					<div className="ml-3 text-xs font-normal">{successMessage}</div>
					{/* <Toast.Toggle /> */}
				</Toast>
			</div>
		</>
	);
}

const inputs = [
	{
		title: 'Tên sự kiện',
		about: 'Tên của sự kiện muốn tổ chức',
		tag: 'event_name',
		type: 'text',
	},
	{
		title: 'Thể loại',
		about: 'Thể loại mà sự kiện hướng đến',
		tag: 'category',
		type: 'select',
	},
	{
		title: 'Ngày diễn ra',
		about: 'Ngày mà sự kiện diễn ra',
		tag: 'occur_date',
		type: 'date',
	},
	{
		title: 'Thời gian',
		about: 'Khung thời gian sự kiện diễn ra',
		tag: 'time',
		type: 'text',
	},
	{
		title: 'Địa điểm',
		about: 'Nơi sự kiện diễn ra',
		tag: 'location',
		type: 'text',
	},
	{
		title: 'Địa chỉ',
		about: 'Địa chỉ của nơi diễn ra sự kiện',
		tag: 'address',
		type: 'text',
	},
	{
		title: 'Banner sự kiện',
		tag: 'banner',
		type: 'file',
	},
	{
		title: 'Giới thiệu sự kiện',
		tag: 'introduce',
		type: 'textarea',
	},
];
