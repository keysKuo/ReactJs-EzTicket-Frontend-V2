import axios from 'axios';
import { Carousel, LoadingImgCard, LoadingTextCard } from '../../components/Client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchDataEvents = async () => {
			setLoading(true);
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/event/search`,
				method: 'GET',
			};
			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setEvents([...result.events]);
					}

					console.log(result);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		fetchDataEvents();
	}, []);

	return (
		<div className="w-[100%] flex-col mt-[4.5rem] min-h-screen flex items-center ">
			<div className="w-[70%] mt-10">{loading ? <LoadingImgCard /> : <Carousel list={events} />}</div>

			<div className="w-[90%] mt-16">
				<section className="flex justify-center overflow-hidden">
					<div className="max-w-[100%] px-4">
						<div className="desktop:mx-[-16px] mx-[-12px]">
							<div
								className="grid gap-2
									desktop:grid-cols-4 laptop:grid-cols-3 tablet:grid-cols-2 grid-cols-1"
							>
								{loading ? (
									<>
										<div className="flex flex-col w-[100%] justify-start pointer bg-transparent px-3 py-3">
											<LoadingImgCard />
											<LoadingTextCard />
										</div>
										<div className="flex flex-col w-[100%] justify-start pointer bg-transparent px-3 py-3">
											<LoadingImgCard />
											<LoadingTextCard />
										</div>
										<div className="flex flex-col w-[100%] justify-start pointer bg-transparent px-3 py-3">
											<LoadingImgCard />
											<LoadingTextCard />
										</div>
									</>
								) : (
									<>
										{events &&
											events.map((event, index) => {
												return (
													<Link
														key={index}
														to={`/event/${event.slug}`}
														className="flex flex-col w-[100%] justify-start pointer bg-transparent px-3 py-3"
														onClick={() => {
															window.scrollTo(0, 0);
														}}
													>
														<img
															src={event.banner}
															alt="Test"
															className="object-cover max-w-[100%] h-32 rounded-lg"
														/>
														<div className="mt-2">
															<h4 className="text-sm font-medium leading-6 hover:text-emerald-200">
																{event.event_name}
															</h4>
															<div className="mt-1 text-sm leading-5 text-gray-400">
																{new Date(event.occur_date).toLocaleDateString('vi-vn')}
															</div>
															<div className="mt-1 text-sm leading-5 text-gray-400">
																{event.category.category_name}
															</div>
														</div>
													</Link>
												);
											})}
									</>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
