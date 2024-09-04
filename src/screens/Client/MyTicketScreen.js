import axios from 'axios';
import { Table, Modal, TextInput, Textarea, FileInput, Label, Spinner, Toast, Pagination } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiCheck, HiExclamation, HiPaperAirplane, HiReceiptRefund } from 'react-icons/hi';
import {
	LuBadgeHelp,
	LuDownload,
	LuFolder,
	LuLogOut,
	LuMail,
	LuReceipt,
	LuSend,
	LuTicket,
	LuUser,
	LuVibrate,
} from 'react-icons/lu';
import { Link } from 'react-router-dom';

const headcells = ['Sự kiện', 'Mã giao dịch', 'Danh sách vé', 'Đơn giá', 'Số lượng', 'Ngày đặt vé'];

export default function MyTicketScreen() {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [bookings, setBookings] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState({});
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(() => {
		const userJson = localStorage.getItem('user');
		return userJson ? JSON.parse(userJson) : null;
	});
	const [formData, setFormData] = useState({
		booking: '',
		trade_code: '',
		reason: '',
		file: null,
		status: 'pending',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const [currentTag, setCurrentTag] = useState('all');
	var currentDate = new Date();
	useEffect(() => {
		setLoading(true);
		const FetchDataBookings = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/booking/search`,
				method: 'GET',
				params: {
					customer: user._id,
					tag: currentTag,
					page: currentPage,
					limit: 10,
				},
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setBookings(result.bookings);
						setTotalCount(result.total);
					}
					setLoading(false);
					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		FetchDataBookings();
	}, [currentTag, currentPage]);

	const handleFileChange = (event) => {
		const files = event.target.files;
		if (files.length > 0) {
			const file = files[0];
			// console.log(file);
			setFormData({ ...formData, file: file });
		}
	};

	const handleClickMail = (booking) => {
		setSelectedBooking(booking);
		setOpenModal2(true);
	};

	const handleSendMail = (trade_code) => {
		const ResendTicket = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/ticket/resend/${trade_code}/${user._id}`,
				method: 'GET',
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setSuccessMessage('Vé đã được gửi đến email của bạn.');
					}

					console.log(result);
				})
				.catch((err) => {
					console.log(err);
				});

			console.log(options);
		};
		ResendTicket();
	};

	const handleClickPrint = () => {
		console.log('print');
	};

	const onPageChange = (page) => {
		setCurrentPage(page);
	};

	const [openModal, setOpenModal] = useState(false);
	const [openModal2, setOpenModal2] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleClickRefund = (booking_id, trade_code) => {
		setFormData({ ...formData, booking: booking_id, trade_code: trade_code });
		setOpenModal(true);
		console.log(booking_id);
	};

	const handleSendRefund = () => {
		setIsLoading(true);

		const SendRefundRequest = async () => {
			if (!formData['reason']) {
				setTimeout(() => {
					setOpenModal(false);
					setIsLoading(false);
					setErrorMessage('Vui lòng điền lý do hoàn tiền');
				}, 2000);
				return;
			}

			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/refund/create`,
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				params: {},
				data: formData,
			};

			await axios
				.request(options)
				.then((response) => {
					const result = response.data;

					if (result.success) {
						setOpenModal(false);
						setSuccessMessage('Yêu cầu hoàn tiền thành công');
					}

					console.log(result);
				})
				.catch((err) => {
					setErrorMessage('Yêu cầu hoàn tiền thất bại: ' + err);
					console.log(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		};

		SendRefundRequest();
	};

	return (
		<section className="w-full min-h-[100dvh] mt-[6.5rem] bg-zinc-800">
			<div className="w-[80%] bg-zinc-800 h-screen mx-auto">
				<div className="flex">
					<div className="block w-[20%] mt-14">
						<div className="flex flex-row gap-3 items-center justify-start">
							<img
								src="https://static.ticketbox.vn/avatar.png"
								className="rounded-full w-10 h-10 object-cover"
							/>
							<div className="flex flex-col gap-1">
								<span className="text-sm whitespace-nowrap leading-5 w-[80%]">Tài khoản của bạn</span>
								<span className="text-base whitespace-nowrap leading-5 w-[80%]">{user.fullname}</span>
							</div>
						</div>

						<ul className="py-4 list-none space-y-2 mt-3">
							<li className="w-[100%] flex gap-2 items-center justify-start py-1 pl-6 text-sm leading-5 cursor-pointer">
								<LuUser size={20} />
								<span className="text-sm">Tài khoản của bạn</span>
							</li>
							<li className="w-[100%] flex gap-2 items-center justify-start py-1 pl-6 text-sm leading-5 cursor-pointer">
								<LuTicket size={20} />
								<span className="text-sm">Vé của bản</span>
							</li>
							<li className="w-[100%] flex gap-2 items-center justify-start py-1 pl-6 text-sm leading-5 cursor-pointer ">
								<LuFolder size={20} />
								<span className="text-sm">Hồ sơ ban tổ chức</span>
							</li>
							<li className="w-[100%] flex gap-2 items-center justify-start py-1 pl-6 text-sm leading-5 cursor-pointer">
								<LuBadgeHelp size={20} />
								<span className="text-sm">Hỗ trợ</span>
							</li>
							<li className="w-[100%] flex gap-2 items-center justify-start py-1 pl-6 text-sm leading-5 cursor-pointer">
								<LuLogOut size={20} />
								<span className="text-sm">Đăng xuất</span>
							</li>
						</ul>
					</div>

					<div className="w-[80%] pb-8 min-h-[100vh] mt-14 px-4 overflow-auto">
						<div className="text-2xl font-medium leading-6 pb-4 ">Vé đã mua</div>

						<div className="block w-[100%] h-[1px] bg-gray-200"></div>

						<div className="relative overflow-auto">
							<div className="mt-4 flex gap-4 items-center justify-center w-[100%]">
								<button
									onClick={() => setCurrentTag('all')}
									className={`flex items-center justify-center p-1 flex-grow basis-0 rounded-xl leading-5 bg-black ${
										currentTag === 'all' ? 'bg-main' : 'bg-black'
									}`}
								>
									Tất cả
								</button>
								<button
									onClick={() => setCurrentTag('upcoming')}
									className={`flex items-center justify-center p-1 flex-grow basis-0 rounded-xl leading-5 bg-black ${
										currentTag === 'upcoming' ? 'bg-main' : 'bg-black'
									}`}
								>
									Sắp diễn ra
								</button>
								<button
									onClick={() => setCurrentTag('finished')}
									className={`flex items-center justify-center p-1 flex-grow basis-0 rounded-xl leading-5 bg-black ${
										currentTag === 'finished' ? 'bg-main' : 'bg-black'
									}`}
								>
									Đã kết thúc
								</button>
							</div>
						</div>

						<div className="mt-10 relative">
							{loading ? (
								<div className="text-center">
									<Spinner aria-label="Center-aligned spinner example" />
								</div>
							) : (
								<div className="flex flex-col items-center justify-center ">
									{bookings.length !== 0 ? (
										<div className="w-full">
											<Table hoverable>
												<Table.Head>
													{headcells.map((cell, index) => {
														return (
															<Table.HeadCell className="text-center" key={index}>
																{cell}
															</Table.HeadCell>
														);
													})}

													<Table.HeadCell className="text-center">
														<span>Yêu cầu</span>
													</Table.HeadCell>
												</Table.Head>
												<Table.Body className="divide-y text-center">
													{bookings &&
														bookings.map((booking, index) => {
															return (
																<Table.Row
																	key={index}
																	className="bg-white dark:border-gray-700 dark:bg-gray-800"
																>
																	<Table.Cell className="text-xs flex items-center justify-center">
																		<img
																			className="cursor-pounter max-w-48"
																			src={booking.event.banner}
																		/>
																	</Table.Cell>

																	<Table.Cell className="text-xs">{booking.trade_code}</Table.Cell>

																	<Table.Cell className="text-xs">
																		{booking.tickets.map((ticket, idx) => {
																			return (
																				<p className="my-2" key={idx}>
																					{ticket.ticket_type.ticket_name}
																				</p>
																			);
																		})}
																	</Table.Cell>

																	<Table.Cell className="text-xs">
																		{booking.tickets.map((ticket, idx) => {
																			return (
																				<p className="my-2" key={idx}>
																					{ticket.price.toLocaleString('vi-vn')}đ
																				</p>
																			);
																		})}
																	</Table.Cell>

																	<Table.Cell className="text-xs text-center">
																		{booking.tickets.map((ticket, idx) => {
																			return (
																				<p className="my-2" key={idx}>
																					{ticket.qty}
																				</p>
																			);
																		})}
																	</Table.Cell>

																	<Table.Cell className="text-xs">
																		{new Date(booking.createdAt).toLocaleString('vi-vn')}
																	</Table.Cell>

																	<Table.Cell>
																		{booking.status === 'refunded' ? (
																			<p className="text-main text-xs">Đã hoàn tiền</p>
																		) : (
																			<div className="flex flex-row gap-3 justify-between text-xs font-medium hover:underline text-center">
																				{new Date(booking.event.occur_date) > currentDate && (
																					<>
																						<LuReceipt
																							size={18}
																							className="text-emerald-600"
																							title="Yêu cầu hoàn tiền"
																							onClick={() => {
																								handleClickRefund(
																									booking._id,
																									booking.trade_code,
																								);
																							}}
																						/>
																						<LuMail
																							size={18}
																							className="text-rose-600"
																							title="Gửi lại vé sự kiện"
																							onClick={() => {
																								handleClickMail(booking);
																							}}
																						/>
																						<LuDownload
																							size={18}
																							className="text-cyan-500"
																							title="In vé cứng"
																						/>
																					</>
																				)}
																			</div>
																		)}
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
										</div>
									) : (
										<section className="mt-10">
											<svg
												width="260"
												height="260"
												viewBox="0 0 260 260"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<mask
													id="ticket-empty_svg__a"
													maskUnits="userSpaceOnUse"
													x="0"
													y="0"
													width="260"
													height="260"
												>
													<circle cx="130" cy="130" r="130" fill="#C4C4C4"></circle>
												</mask>
												<g mask="url(#ticket-empty_svg__a)">
													<path d="M262.772 0H-3.25v260h266.022V0z" fill="#F59D5D"></path>
													<path
														d="M181.404 134.687c26.147 0 47.342-21.196 47.342-47.342 0-26.146-21.195-47.342-47.342-47.342-26.146 0-47.342 21.196-47.342 47.342 0 26.146 21.196 47.342 47.342 47.342z"
														fill="#FFD530"
													></path>
													<path d="M262.772 97.628H-3.25V260h266.022V97.628z" fill="#FFDDB3"></path>
													<path
														d="M107.376 183.187s-3.846.531-8.62-1.371"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M-3.25 147.048s11.088 1.317 31.355-5.253c20.266-6.569 10.257 5.43 20.39 8.56 10.134 3.13 30.02-4.943 50.26-7.976 20.24-3.033 19.161 15.191 40.065 15.191 33.247 0 29.701-16.561 61.56-16.561 20.152 0 13.547 15.279 34.839 15.279 13.201 0 27.553-9.24 27.553-9.24v-15.236H-3.25v15.236z"
														fill="#fff"
													></path>
													<path d="M262.772 75.222H-3.25v50.366h266.022V75.222z" fill="#EE4F14"></path>
													<path
														d="M-3.25 140.814s11.088 1.318 31.355-5.252c20.266-6.57 16.464 5.226 26.598 8.356 10.133 3.13 23.812-4.731 44.052-7.772 20.24-3.033 27.517 13.856 48.421 13.643 20.903-.212 19.966-11.848 51.78-13.643 22.743-1.282 27.447 8.143 34.194 10.672 11.946 4.483 29.622-6.004 29.622-6.004v-15.235H-3.25v15.235z"
														fill="#EE4F14"
													></path>
													<path
														opacity="0.5"
														d="M182.2 90.554c26.586 0 48.138-1.437 48.138-3.21 0-1.772-21.552-3.21-48.138-3.21s-48.138 1.438-48.138 3.21c0 1.773 21.552 3.21 48.138 3.21zM170.714 98.539c17.473 0 31.638-.974 31.638-2.175 0-1.202-14.165-2.175-31.638-2.175-17.473 0-31.638.973-31.638 2.175 0 1.201 14.165 2.175 31.638 2.175zM161.014 106.523c12.121 0 21.947-.974 21.947-2.175 0-1.201-9.826-2.175-21.947-2.175-12.121 0-21.947.974-21.947 2.175 0 1.201 9.826 2.175 21.947 2.175z"
														fill="#FFD530"
													></path>
													<path
														d="M113.823 194.452l-38.447 39.251c-.76.778-1.972-.274-1.309-1.141l29.127-37.579a.412.412 0 00-.327-.664l-16.297-.008a.426.426 0 00-.265.097L7.644 260h92.65l30.444-65.079a.41.41 0 00-.371-.584l-16.244-.009a.417.417 0 00-.3.124z"
														fill="#2A2D34"
													></path>
													<path
														d="M131.534 94.091s5.217-2.325 8.975 1.238c3.758 3.564 2.935 7.596 2.369 8.701-1.096 2.149-7.551 6.057-10.204 4.156-2.944-2.113-.848-10.549-.848-10.549"
														fill="#FFD530"
													></path>
													<path
														d="M131.534 94.091s5.217-2.325 8.975 1.238c3.758 3.564 2.935 7.596 2.369 8.701-1.096 2.149-7.551 6.057-10.204 4.156-2.944-2.113-.848-10.549-.848-10.549"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M133.903 147.392s3.343 8.117 3.343 15.881c-.009 10.929-3.175 15.111-4.775 19.197 0 0-.009 8.417-1.45 11.866-1.45 3.448-12.804 3.378-15.872 1.132-3.873-2.821-5.164-12.282-5.164-12.282H107.385s-.964 9.461-4.845 12.273c-3.077 2.237-14.66 2.299-16.102-1.15-1.442-3.448-1.008-11.866-1.008-11.866-1.592-4.085-4.96-8.276-4.96-19.206 0-7.763 3.36-15.88 3.36-15.88v-6.358l47.571 1.211"
														fill="#FFD530"
													></path>
													<path
														d="M133.903 147.392s3.343 8.117 3.343 15.881c-.009 10.929-3.175 15.111-4.775 19.197 0 0-.009 8.417-1.45 11.866-1.45 3.448-12.804 3.378-15.872 1.132-3.873-2.821-5.164-12.282-5.164-12.282H107.385s-.964 9.461-4.845 12.273c-3.077 2.237-14.66 2.299-16.102-1.15-1.442-3.448-1.008-11.866-1.008-11.866-1.592-4.085-4.96-8.276-4.96-19.206 0-7.763 3.36-15.88 3.36-15.88v-6.358l47.571 1.211"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M108.853 145.677c-14.262.009-22.336-3.157-25.368-4.669v-3.51c2.785 1.335 11.98 5.093 25.368 5.084 13.387.009 22.583-3.749 25.369-5.084v3.51c-3.033 1.504-11.106 4.669-25.369 4.669z"
														fill="#2DC275"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M142.551 104.489c-6.693-17.118-24.104-18.966-33.609-18.984h-.177c-9.497.018-26.916 1.866-33.61 18.984-8.586 21.965 8.444 33 8.444 33a61.224 61.224 0 0011.39 3.678 61.744 61.744 0 0013.864 1.406 61.23 61.23 0 0013.865-1.406 61.25 61.25 0 0011.389-3.678c0 .009 17.03-11.035 8.444-33z"
														fill="#FFD530"
													></path>
													<path
														d="M134.195 137.497c-2.785 1.335-11.963 5.093-25.351 5.084-13.387-.009-22.565-3.74-25.35-5.084 0 0-17.031-11.044-8.445-33 6.729-17.225 24.334-18.993 33.795-18.984 9.462-.01 27.058 1.76 33.796 18.984 8.586 21.956-8.445 33-8.445 33z"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M96.721 161.841s1.327.362 10.39 4.324c4.58 1.998 4.271 10-2.75 11.097-6.234.981-10.646-4.227-7.64-15.421z"
														fill="#fff"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M128.43 143.201c2.741-.717 5.792-2.193 5.792-2.193s10.505 15.182 6.163 26.111c-4.342 10.929-20.47 11.363-23.158 5.093-2.732-6.357 2.865-11.424 11.017-13.166"
														fill="#FFD530"
													></path>
													<path
														d="M128.43 143.201c2.741-.717 5.792-2.193 5.792-2.193s10.505 15.182 6.163 26.111c-4.342 10.929-20.47 11.363-23.158 5.093-2.732-6.357 2.865-11.424 11.017-13.166"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														d="M83.484 156.933c2.202 2.051 13.768 5.986 8.78 13.529-3.837 5.809-12.254 5.234-16.357-3.458-5.023-10.628 7.321-26.005 7.321-26.005s3.042 1.477 5.792 2.193"
														fill="#FFD530"
													></path>
													<path
														d="M83.484 156.933c2.202 2.051 13.768 5.986 8.78 13.529-3.837 5.809-12.254 5.234-16.357-3.458-5.023-10.628 7.321-26.005 7.321-26.005s3.042 1.477 5.792 2.193"
														stroke="#2A2D34"
														stroke-width="2"
														stroke-miterlimit="10"
														stroke-linecap="round"
														stroke-linejoin="round"
													></path>
													<path
														opacity="0.2"
														d="M83.2 137.392v3.524c.106.054.222.107.337.169v.115c-.373-.168-.603-.284-.603-.284s-12.383 15.428-7.341 26.106c1.509 3.186 3.595 5.281 5.823 6.382 1.127 4.074 2.76 6.613 3.737 9.116 0 0-.444 8.45 1.012 11.912 1.446 3.462 13.075 3.409 16.163 1.154 3.888-2.832 4.865-12.32 4.865-12.32h2.609s1.296 9.497 5.184 12.329c1.607 1.172 5.441 1.749 8.965 1.553 1.039-6.133-2.494-21.161-2.494-21.161 3.027-.178 7.385.32 11.175-12.329 3.791-12.649-11.104-18.747-11.104-18.747l-.524-3.506c9.374-4.421 13.226-16.706 11.841-25.431-1.526-9.622-10.385-24.588-32.851-23.523-10.412.48-17.948 3.835-23.052 7.297a30.007 30.007 0 00-2.201 4.509c-8.62 22.049 8.477 33.127 8.477 33.127"
														fill="#000"
													></path>
												</g>
												<g clip-path="url(#ticket-empty_svg__clip0)">
													<path
														opacity="0.2"
														d="M128.115 133.404v.106c-.349-.162-.553-.26-.553-.26"
														fill="#000"
													></path>
												</g>
												<defs>
													<clipPath id="ticket-empty_svg__clip0">
														<path fill="#fff" d="M127.562 133.25h.552v.26h-.552z"></path>
													</clipPath>
												</defs>
											</svg>

											<div className="text-base leading-6 text-center mt-4">Bạn chưa có vé nào</div>

											<div className="mt-12 text-center">
												<Link to="/">
													<button className="bg-main rounded h-10 leading-6 px-5">Mua vé ngay</button>
												</Link>
											</div>
										</section>
									)}
								</div>
							)}
						</div>

						<div className="py-5"></div>
					</div>
				</div>
			</div>

			<>
				<Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
					<Modal.Header />
					<Modal.Body>
						<div className="space-y-5">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">Yêu cầu hoàn tiền</h3>

							<div>
								<div className="mb-2 block">
									<Label value="Mã đơn hàng" />
								</div>
								<TextInput readOnly value={formData['trade_code']} />
							</div>
							<div>
								<div className="mb-2 block">
									<Label value="Lý do" />
								</div>
								<Textarea
									onChange={(e) => {
										setFormData({ ...formData, reason: e.target.value });
									}}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label value="Đính kèm" />
								</div>
								<FileInput
									onChange={(e) => {
										handleFileChange(e);
									}}
								/>
							</div>
							<div className="w-full flex justify-end">
								<button
									onClick={() => {
										handleSendRefund();
									}}
									className="btn bg-main"
								>
									{isLoading ? <Spinner /> : `Gửi yêu cầu`}
								</button>
							</div>
						</div>
					</Modal.Body>
				</Modal>

				<Modal show={openModal2} size="md" onClose={() => setOpenModal2(false)} popup>
					<Modal.Header />
					<Modal.Body>
						<div className="text-center">
							<LuMail className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-gray-200" />
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								Bạn muốn nhận lại vé thông qua email?
							</h3>
							<div className="flex justify-center gap-4">
								<button
									onClick={() => {
										handleSendMail(selectedBooking.trade_code);
										setOpenModal2(false);
									}}
									className="btn bg-main"
								>
									{'Xác nhận'}
								</button>
								<button style={{ background: '#314133' }} className="btn" onClick={() => setOpenModal2(false)}>
									Hủy
								</button>
							</div>
						</div>
					</Modal.Body>
				</Modal>

				<div className={`fixed right-3 bottom-5 ${errorMessage !== '' ? 'block' : 'hidden'}`}>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
							<HiExclamation className="h-5 w-5" />
						</div>
						<div className="ml-3 text-xs font-normal">{errorMessage}</div>
						<Toast.Toggle />
					</Toast>
				</div>
				<div className={`fixed right-3 bottom-5 ${successMessage !== '' ? 'block' : 'hidden'}`}>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-400 dark:bg-emerald-700 dark:text-emerald-200">
							<HiCheck className="h-5 w-5" />
						</div>
						<div className="ml-3 text-xs font-normal">{successMessage}</div>
						<Toast.Toggle />
					</Toast>
				</div>
			</>
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
