import { Table } from 'flowbite-react';
import { LuAlarmClock, LuMapPin, LuTicket } from 'react-icons/lu';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TicketList from '../../components/Client/TicketList';

export default function EventDetailScreen() {
	const { event_slug } = useParams();
	const [event, setEvent] = useState(null);

	useEffect(() => {
		const fetchDataEvent = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/event/view/${event_slug}`,
				method: 'GET',
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						console.log(result.event);
						setEvent({ ...result.event });
					}

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
			{event && (
				<section className="mt-[6.5rem] min-h-screen bg-black-500">
					<img className="w-full" src={event.banner} />

					<div className="event-content px-5 w-[65%] mx-auto mt-10 min-h-screen">
						<div className="grid grid-cols-4 gap-4 my-5">
							<div className="desktop:col-span-3 laptop:col-span-2 col-span-4 min-h-[100%]">
								<div className="flex flex-col">
									<div className="px-6 py-0 overflow-hidden bg-zinc-800">
										<TicketList
											time={`${event.time} ${new Date(event.occur_date).toLocaleDateString('vi-vn')}`}
											ticket_types={event.ticket_types}
											qty={false}
										/>
									</div>
									<div className="px-6 py-0 overflow-hidden bg-zinc-800 mt-5">
										<h4 className="py-3 px-0 border-b border-emerald-300 text-md text-emerald-300 font-medium mt-3">
											Giới thiệu sự kiện
										</h4>

										<div className="event-about py-3 px-0 mt-5">
											<div className="relative overflow-hidden ">
												<div className="leading-6 text-sm">
													<div dangerouslySetInnerHTML={{ __html: event.introduce }} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div
								className="desktop:col-span-1 laptop:col-span-2 laptop:flex flex-col hidden 
						rounded-lg bg-zinc-800 relative  max-h-[320px]"
							>
								<Link
									to={`/event/${event.slug}/booking`}
									className="absolute w-[100%] bottom-0 pointer
							px-3 py-3 bg-main text-center"
								>
									Mua ngay
								</Link>
								<div className="py-0 overflow-hidden rounded-md">
									<div className="rounded-md mb-3 px-2">
										<h2 className="text-left p-4 mb-3 leading-6 font-medium text-sm border-b border-emerald-300">
											{event.event_name}
										</h2>

										<div className="s1 py-2 px-3 flex flex-row items-center">
											<span className="">
												<LuAlarmClock size={20} />
											</span>
											<div className="ev-txt ml-4 relative">
												<span className="block text-sm">{event.time}</span>
											</div>
										</div>

										<div className="s2 py-4 px-3 flex flex-col mb-1">
											<div className="flex flex-row">
												<span className="">
													<LuMapPin size={20} />
												</span>
												<div className="ev-txt ml-4 relative">
													<span className="block text-sm">{event.location}</span>
												</div>
											</div>
											<div className="flex flex-row">
												<span className=""></span>
												<div className="ev-txt ml-9 relative">
													<span className="block text-xs">{event.address}</span>
												</div>
											</div>
										</div>

										<div
											className="flex flex-row
									border-t border-emerald-300 px-3 py-4"
										>
											<span className="">
												<LuTicket size={20} />
											</span>
											<div className="ev-txt ml-4 relative">
												<span className="block text-sm">
													Từ{' '}
													<span className="text-emerald-300 font-medium">
														{event.ticket_types[0]?.price.toLocaleString('vi-vn')}đ
													</span>
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="laptop:block hidden overflow-hidden bg-none opacity-1 border-0 p-0 mt-12">
									<img
										alt="Ez Ticket"
										src="https://beta.ticketbox.vn/_next/image?url=%2F_next%2Fstatic%2Fimages%2FDefaultAdsbanner.png&w=1920&q=75"
										decoding="async"
										className="absolute w-full mt-10"
									/>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-4 gap-4">
							<div className="laptop:col-span-3 col-span-4 bg-zinc-800 min-h-[100%] rounded-lg"></div>

							<div className="col-span-1 relative"></div>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
