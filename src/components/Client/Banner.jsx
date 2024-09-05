import React from 'react';

const Banner = ({ event }) => {
	return (
		<div className="banner-container w-full px-8 py-6 bg-gradient-to-t from-black to-gray-700 h-auto text-white text-base">
			<div
				className="w-[73%] h-[100%] p-0 rounded-xl overflow-hidden 
                    flex desktop:flex-row flex-col-reverse  mx-auto"
			>
				<div className="text-wrapper flex-1 bg-zinc-800 relative p-8">
					<div
						className="circle1 absolute desktop:block hidden bg-gray-700
                            w-[3.75rem] h-[3.75rem] rounded-full z-12
                            top-0 right-0 translate-x-[1.875rem] translate-y-[-1.875rem]"
					></div>

					<div
						className="circle2 absolute desktop:block hidden bg-black
                            w-[3.75rem] h-[3.75rem] rounded-full z-12
                            bottom-0 right-0 translate-x-[1.875rem] translate-y-[1.875rem]"
					></div>

					<div className="w-[100%] h-[100%] flex flex-col justify-between">
						<div className="flex flex-col justify-center overflow-hidden">
							<p className="text-xl text-emerald-300">{event.event_name}</p>
							<p className="mt-6 flex flex-row">
								<svg
									width="20"
									height="15"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="icon"
								>
									<path
										d="M4.333.333C4.702.333 5 .632 5 1v.667h4V1a.667.667 0 011.333 0v.667H11a2.667 2.667 0 012.667 2.667v1.333H.333V4.334A2.667 2.667 0 013 1.667h.667V1c0-.368.298-.667.666-.667zM13.667 7H.333v5.334c0 .736.597 1.333 1.334 1.333h10.666c.737 0 1.334-.597 1.334-1.333V7z"
										fill="#71B180"
									></path>
								</svg>
								<span className="leading-4 pl-2">
									{event.time}, {new Date(event.occur_date).toLocaleDateString('vi-vn')}
								</span>
							</p>
							<p className="flex items-center mt-6">
								<svg width="20" height="20" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M4.031 3.307a10.514 10.514 0 0113.937 0c4.485 3.945 4.955 10.854 1.058 15.392l-7.015 8.17a1.333 1.333 0 01-2.023 0l-7.015-8.17C-.923 14.161-.454 7.252 4.031 3.307zM11 14.667A3.333 3.333 0 1011 8a3.333 3.333 0 000 6.666z"
										fill="#71B180"
									></path>
								</svg>

								<span className="leading-4 pl-2">{event.location}</span>
							</p>
							<p className="address text-xs ml-7 mb-3">{event.address}</p>
						</div>

						<div className="price border-t border-emerald-300">
							<div className="ticket-price flex items-center gap-2 py-4">
								<span>Giá từ</span>
								<a href="#" className="price-value flex items-center gap-2 text-emerald-300">
									<span>{event.ticket_types[0]?.price.toLocaleString('vi-vn')} đ</span>
									<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M.293.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L5.586 7 .293 1.707a1 1 0 010-1.414z"
											fill="#2DC275"
										></path>
									</svg>
								</a>
							</div>
							<button className="buy-btn w-[100%] desktop:py-1 py-2 rounded font-medium bg-main">
								Mua vé ngay
							</button>
						</div>
					</div>
				</div>

				<div className="img-wrapper flex-1 basis-1/3">
					<img className="h-[100%]" src={event.banner} alt="Banner cover" />
				</div>
			</div>
		</div>
	);
};

export default Banner;
