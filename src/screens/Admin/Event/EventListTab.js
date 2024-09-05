import { useEffect, useState } from 'react';
import EditForm from '../../../components/Admin/EditForm';
import ListTable from '../../../components/Admin/ListTable';
import axios from 'axios';
import UpdateEventTab from './UpdateEventTab';
import { Checkbox, Table, Pagination } from 'flowbite-react';
import { LuFileEdit, LuTicket, LuTrash } from 'react-icons/lu';
import { HiPencil, HiStatusOffline, HiStatusOnline, HiTrash } from 'react-icons/hi';
import SkeletonEvent from '../../../components/Admin/SkeletonEvent';
import { useNavigate } from 'react-router-dom';

export default function EventListTab({}) {
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({});
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState('');

	const [user, setUser] = useState(() => {
		const userJson = localStorage.getItem('user');
		return userJson ? JSON.parse(userJson) : null;
	});

	const onPageChange = (page) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		const options = {
			method: 'GET',
			url: `${process.env.REACT_APP_API_URL}/api/event/search`,
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				author: user._id,
				limit: 10,
				page: currentPage,
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
					setTotalCount(result.total);
					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchDataEvent();
	}, [currentPage]);

	const navigate = useNavigate();
	const handleOnEditEvent = (event_id) => {
		navigate(`/business/events/${event_id}`);
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
						{loading ? (
							<SkeletonEvent />
						) : (
							<>
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
													<Table.Row
														key={index}
														className="bg-white dark:border-gray-700 dark:bg-gray-800"
													>
														<Table.Cell className="p-4">
															<Checkbox />
														</Table.Cell>

														<Table.Cell className="text-xs">
															<img className="cursor-pounter max-w-48" src={event.banner} />
														</Table.Cell>

														<Table.Cell className="text-xs">{event.event_name}</Table.Cell>
														<Table.Cell className="text-xs">
															{new Date(event.occur_date).toLocaleDateString('vi-vn')} <br />{' '}
															{event.time}
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
																	className="cursor-pointer"
																	title="Cập nhật sự kiện"
																	size={20}
																	onClick={() => {
																		handleOnEditEvent(event._id);
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
								<div className="flex items-center justify-center mt-20">
									<Pagination
										theme={PaginationTheme}
										previousLabel="Trước"
										nextLabel="Sau"
										currentPage={currentPage}
										totalPages={Math.ceil(totalCount / 10)}
										onPageChange={onPageChange}
										showIcons
									/>
								</div>
							</>
						)}
					</div>
				</section>
			)}
		</>
	);
}

const headcells = ['Banner', 'Tên sự kiện', 'Ngày diễn ra', 'Địa điểm', 'Trạng thái'];

const PaginationTheme = {
	base: '',
	layout: {
		table: {
			base: 'text-sm text-gray-700 dark:text-gray-400',
			span: 'font-semibold text-gray-900 dark:text-white',
		},
	},
	pages: {
		base: 'xs:mt-0 mt-2 inline-flex items-center -space-x-px',
		showIcon: 'inline-flex',
		previous: {
			base: 'ml-0  -gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
			icon: 'h-5 w-5',
		},
		next: {
			base: ' -gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
			icon: 'h-5 w-5',
		},
		selector: {
			base: 'w-12  -gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
			active:
				'bg-main text-white hover:bg-cyan-100 hover:text-cyan-700 dark:-gray-700 dark:bg-gray-700 dark:text-white',
			disabled: 'opacity-50 cursor-normal',
		},
	},
};
