import axios from 'axios';
import { Pagination, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { LuCalendar, LuGrid, LuMapPin, LuSearch } from 'react-icons/lu';
import { Link, useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';

export default function EventListScreen() {
	const [events, setEvents] = useState([]);
	const [totalCount, setTotalCount] = useState();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchText, setSearchText] = useState(searchParams.get('search') || '');
	const [currentPage, setCurrentPage] = useState(1);
	const { category_slug } = useParams();
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, isLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const FetchDataEventsBySlug = async () => {
			isLoading(true);
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/event/search_by_category?slug=${category_slug}&search=${
					searchText || ''
				}&page=${currentPage || 1}`,
				method: 'GET',
			};
			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						if (result.events.length == 0) {
							setErrorMessage('Không tìm thấy sự kiện tương ứng');
						}
						setEvents(result.events);
						setCurrentPage(Number(searchParams.get('page')) || 1);
						setTotalCount(result.total || 0);
					}
					isLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setErrorMessage('Không tìm thấy sự kiện tương ứng');
				});
		};
		FetchDataEventsBySlug();
	}, [category_slug, currentPage, searchText]);
	const onPageChange = (page) => {
		setCurrentPage(page);
		navigate(`${location.pathname}?page=${page}&search=${searchText}`);
	};

	const handleSearchOnClick = () => {
		navigate(`${location.pathname}?page=${currentPage}&search=${searchText}`);
	};

	return (
		<section className="w-full mt-[4.5rem] min-h-screen flex">
			<div className="w-full mx-auto">
				<div className="page-header py-14 text-center">
					<h1 className="text-2xl leading-10 py-6 font-bold">Thế giới sự kiện đặc sắc</h1>

					<div className="w-full clear-both">
						<div className="w-[60%] mx-auto clear-both p-0">
							<div className="w-full">
								<div className="w-full border-2 text-black-500 border-black-500 flex items-center relative border-collapse">
									<input
										onChange={(e) => setSearchText(e.target.value || '')}
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSearchOnClick();
										}}
										value={searchText}
										className="w-full h-[54px] px-5 text-md outline-none -none rounded"
										placeholder="Tìm sự kiện, triễn lãm, hoạt động vui chơi ..."
									/>
									<button className="text-gray-600 -0 absolute right-5 leading-5 rounded">
										<LuSearch size={20} />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="event-list w-full mt-12">
					<div className="w-full relative clear-both">
						{loading ? (
							<div className="text-center">
								<Spinner aria-label="Center-aligned spinner example" />
							</div>
						) : (
							<div className="container mx-auto">
								{events.length !== 0 ? (
									<>
										<div className="min-h-[300px] grid desktop:grid-cols-3 tablet:grid-cols-2 gap-8">
											{events.map((event, index) => {
												return (
													<Link
														to={`/event/${event.slug}`}
														key={index}
														className="bg-white text-black-500 "
													>
														<div className="flex flex-col">
															<div className="img-container w-full overflow-hidden object-cover">
																<img src={event.banner} />
															</div>

															<div className="body-container p-3">
																<h1 className="w-full text-lg font-medium mb-3 min-h-14">
																	{event.event_name}
																</h1>

																<div className="flex items-center justify-between">
																	<div className="flex items-center">
																		<span className="text-sm text-black-300 pr-1">Từ</span>
																		<strong className="text-md text-main">
																			{(event.ticket_types[0]?.price || 0).toLocaleString('vi-vn')}đ
																		</strong>
																	</div>
																	<div className="whitespace-nowrap flex items-center">
																		<div className="flex items-center gap-2 text-sm">
																			<LuCalendar color={'#71B190'} />
																			<span>
																				{new Date(event.occur_date).toLocaleDateString('vi-vn')}
																			</span>
																		</div>
																	</div>
																</div>

																<div className="flex items-center justify-between mt-2">
																	<div className="flex items-center gap-1">
																		<LuGrid color="71B190" />
																		<span className="text-sm text-black-300 pr-1">
																			{event.category.category_name}
																		</span>
																	</div>
																	<div className="whitespace-nowrap flex items-center">
																		<div className="flex items-center gap-2 text-sm">
																			<span className="p-1 border border-gray-300">
																				{event.location}
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</Link>
												);
											})}
										</div>
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
								) : (
									<div class="w-full h-[50dvh] flex justify-center items-center">
										<h1>{errorMessage}</h1>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

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
