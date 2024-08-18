import { useEffect, useState } from 'react';
import axios from 'axios';
import { Checkbox, Table, ToggleSwitch } from 'flowbite-react';
import { LuFileEdit, LuTicket, LuTrash } from 'react-icons/lu';
import { HiDownload, HiPencil, HiStatusOffline, HiStatusOnline, HiTrash } from 'react-icons/hi';
import UpdateEventTab from '../Event/UpdateEventTab';
const headcells = ['Banner', 'Tên sự kiện', 'Ngày diễn ra', 'Địa điểm', 'Trạng thái'];

export default function ApproveListTab({}) {
	const [isEditing, setIsEditing] = useState(false);
	const [eventStates, setEventStates] = useState([]);

	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState('');

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/event/search`,
			headers: {
				'Content-Type': 'application/json',
			},
			params: {},
		};

		const fetchDataEvent = async () => {
			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setEvents(result.events);
					}

					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchDataEvent();
	}, [eventStates]);

	useEffect(() => {
		if (events.length !== 0) {
			setEventStates(
				events.map((event) => {
					return event.status === 'published';
				}),
			);
		}
	}, []);

	const handleProveEvent = (event_id, is_approved) => {
		const ProveEvent = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/admin/prove_event/${event_id}/${is_approved}`,
				method: 'PUT',
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
					}

					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		// console.log(event_id, is_approved);
		ProveEvent();
	};

	return (
		<>
			{isEditing ? (
				<UpdateEventTab event_id={selectedEvent} setIsEditing={setIsEditing} />
			) : (
				<section className="px-6 py-4 mt-[-10px]">
					<div className="flex items-center justify-between mb-10">
						<div className="grow">
							<div className="relative pt-2">
								<h1 className="text-2xl whitespace-nowrap">Danh sách sự kiện</h1>
							</div>
							<p className="whitespace-nowrap overflow-hidden text-xs text-gray-400 ">API ID: 315F4</p>
						</div>
					</div>

					<div className="overflow-x-auto">
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell className="p-4"></Table.HeadCell>

								{headcells.map((cell, index) => {
									return <Table.HeadCell key={index}>{cell}</Table.HeadCell>;
								})}

								<Table.HeadCell>
									<span className="sr-only">Edit</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y">
								{events &&
									events.map((event, index) => {
										return (
											<Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
												<Table.Cell className="text-xs">
													<img className="cursor-pounter max-w-48" src={event.banner} />
												</Table.Cell>

												<Table.Cell className="text-xs">{event.event_name}</Table.Cell>
												<Table.Cell className="text-xs">
													{new Date(event.occur_date).toLocaleDateString('vi-vn')} <br /> {event.time}
												</Table.Cell>
												<Table.Cell className="text-xs">
													{event.location} <br /> {event.address}
												</Table.Cell>
												<Table.Cell
													className={`text-xs ${
														event.status === 'published' ? 'text-main' : 'text-orange-400'
													}`}
												>
													{event.status}
												</Table.Cell>

												<Table.Cell>
													<div className="flex flex-row gap-2 text-xs font-medium text-cyan-600 hover:underline dark:text-cyan-500">
														<a target="_blank" href={`${process.env.REACT_APP_API_URL}/${event.license}`}>
															<HiDownload size={20} title="Tải xuống giấy phép" />
														</a>
														<HiPencil
															title="Cập nhật sự kiện"
															size={20}
															onClick={() => {
																setIsEditing(true);
																setSelectedEvent(event._id);
															}}
														/>
														<HiTrash title="Xóa sự kiện" size={20} />
													</div>
												</Table.Cell>

												<Table.Cell className="p-4">
													<ToggleSwitch
														checked={event.status === 'published'}
														onChange={() => {
															let updatedStates = [...eventStates];
															updatedStates[index] = !updatedStates[index];
															setEventStates(updatedStates);
															handleProveEvent(event._id, updatedStates[index]);
														}}
													/>
												</Table.Cell>
											</Table.Row>
										);
									})}
							</Table.Body>
						</Table>
					</div>
				</section>
			)}
		</>
	);
}
