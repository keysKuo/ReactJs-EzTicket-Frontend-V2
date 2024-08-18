import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'flowbite-react';
import { LuChevronDown, LuFolderOpen, LuHelpCircle, LuLogOut, LuSearch, LuTicket, LuUser } from 'react-icons/lu';

const logo_url = process.env.REACT_APP_LOGO_URL;

export default function Header() {
	const [user, setUser] = useState(() => {
		let json = localStorage.getItem('user');
		return json ? JSON.parse(localStorage.getItem('user')) : null;
	});
	const navigate = useNavigate();

	return (
		<header
			className="w-full h-[4.5rem] bg-main px-8
            flex items-center 
            fixed top-0 z-10
            border-b-1 border-slate-500"
		>
			<div className="flex items-center h-[100%] ml-10">
				<Link to="/" className="flex items-center justify-center w-[30%]">
					<img src={logo_url} className="w-[40%]" />
				</Link>

				<div className="flex items-center relative w-[100%]">
					<LuSearch className="absolute left-1 w-10 text-gray-300" fill="none" />

					<input
						type="text"
						onClick={() => navigate('/events/search')}
						className="bg-slate-700 outline-none
                        focus:outline-none focus:ring-2 hover:ring-1 hover:ring-white focus:ring-amber-200
                        text-white text-sm leading-8 h-8 px-12 py-5 rounded border-0 caret-green-300"
						placeholder="Tìm kiếm"
					/>
				</div>
			</div>
			<div className="flex items-center justify-center h-[100%] mr-10 ml-auto">
				<Link
					to="/business/events"
					className="flex items-center justify-center w-32 mx-4 
                    bg-slate-700 text-white text-sm
                    h-9 leading-9 min-w-[90px] 
                    rounded-lg"
				>
					Tạo sự kiện
				</Link>

				<div className="cursor-pointer">
					<Link to="#" className="flex items-center">
						<LuTicket className="text-white" size="27" />
					</Link>
				</div>

				<div className="flex items-center text-white text-sm">
					{user ? (
						<span className="px-4 cursor-pointer">
							<Dropdown
								label=""
								renderTrigger={() => (
									<span className="flex flex-row gap-1 items-center">
										{user.fullname} <LuChevronDown />{' '}
									</span>
								)}
							>
								<Dropdown.Header>
									<span className="flex flex-row gap-2 text-sm text-center items-center">
										<LuUser /> {user.email}
									</span>
								</Dropdown.Header>
								<Dropdown.Item>
									<Link to="/user/my_tickets" className="flex flex-row gap-2 text-sm text-center items-center">
										<LuTicket /> Vé của bạn
									</Link>
								</Dropdown.Item>
								<Dropdown.Item>
									<Link to="/business" className="flex flex-row gap-2 text-sm text-center items-center">
										<LuFolderOpen /> Quản lý sự kiện
									</Link>
								</Dropdown.Item>
								<Dropdown.Item>
									<span className="flex flex-row gap-2 text-sm text-center items-center">
										<LuHelpCircle /> Hỗ trợ
									</span>
								</Dropdown.Item>

								<Dropdown.Divider />
								<Dropdown.Item>
									<span
										onClick={() => {
											localStorage.removeItem('user');
											localStorage.removeItem('accessToken');
											navigate('/login');
										}}
										className="flex flex-row gap-2 text-sm text-center items-center"
									>
										<LuLogOut /> Đăng xuất
									</span>
								</Dropdown.Item>
							</Dropdown>
						</span>
					) : (
						<Link to="/login" className="px-4">
							Đăng nhập | Đăng ký
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
