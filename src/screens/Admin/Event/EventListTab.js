import { useEffect, useState } from 'react';
import EditForm from '../../../components/Admin/EditForm';
import ListTable from '../../../components/Admin/ListTable';
import axios from 'axios';
import UpdateEventTab from './UpdateEventTab';
import { Checkbox, Table } from 'flowbite-react';
import { LuFileEdit, LuTicket, LuTrash } from 'react-icons/lu';
import { HiPencil, HiStatusOffline, HiStatusOnline, HiTrash } from 'react-icons/hi';
import SkeletonEvent from '../../../components/Admin/SkeletonEvent';

export default function EventListTab({}) {
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({});

	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState('');

	const [user, setUser] = useState(() => {
		const userJson = localStorage.getItem('user');
		return userJson ? JSON.parse(userJson) : null;
	});

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/event/search`,
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				author: user._id,
			},
		};
		const fetchDataEvent = async () => {
			setLoading(true);
			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setEvents(result.events);
					}
					setLoading(false);
					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchDataEvent();
	}, []);

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
						{loading ? (
							<SkeletonEvent />
						) : (
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
													<Table.Cell className="p-4">
														<Checkbox />
													</Table.Cell>

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
															{event.status !== 'published' ? (
																<HiStatusOffline size={20} title="Công bố" />
															) : (
																<HiStatusOnline size={20} title="Công bố" />
															)}
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
												</Table.Row>
											);
										})}
								</Table.Body>
							</Table>
						)}
					</div>
				</section>
			)}
		</>
	);
}

const headcells = ['Banner', 'Tên sự kiện', 'Ngày diễn ra', 'Địa điểm', 'Trạng thái'];
