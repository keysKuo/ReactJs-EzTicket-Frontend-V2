import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'flowbite-react';
import { LuChevronDown, LuFolderOpen, LuHelpCircle, LuLogOut, LuSearch, LuTicket, LuUser } from 'react-icons/lu';
import SubHeaderCategories from './SubHeaderCategories';

const logo_url = process.env.REACT_APP_LOGO_URL;
const categories = [
	{
		title: 'Concert nhạc',
		icon: 'https://i.imgur.com/YyXHyXv.png',
		link: '/events/nhac-song',
	},
	{
		title: 'Sân khấu nghệ thuật',
		icon: 'https://i.imgur.com/ljaLmnS.png',
		link: '/events/san-khau-nghe-thuat',
	},
	{
		title: 'Khoa học - diễn thuyết',
		icon: 'https://i.imgur.com/fX2KeYU.png',
		link: '/events/khoa-hoc-dien-thuyet',
	},
	{
		title: 'Du lịch - khám phá',
		icon: 'https://i.imgur.com/7xTWoNU.png',
		link: '/events/du-lich-kham-pha',
	},
	{
		title: 'Thể dục thể thao',
		icon: 'https://i.imgur.com/Cd7cKEl.png',
		link: '/events/the-duc-the-thao',
	},
	{
		title: 'Hội nghị - triễn lãm',
		icon: 'https://i.imgur.com/l60bw3u.png',
		link: '/events/hoi-nghi-trien-lam',
	},
];

export default function SecondHeader() {
	const [user, setUser] = useState(() => {
		let json = localStorage.getItem('user');
		return json ? JSON.parse(localStorage.getItem('user')) : null;
	});

	const navigate = useNavigate();
	const location = useLocation();
	return (
		<>
			<header
				className="w-full h-16 bg-main 
            flex items-center 
            fixed top-0 z-10
            border-b-1 border-slate-500"
			>
				<div className="flex items-center h-[100%] ml-10 px-8">
					<Link to="/" className="flex items-center justify-center w-[30%]">
						<img src={logo_url} className="w-[30%]" />
					</Link>

					<div className="desktop:flex hidden items-center relative w-[100%]">
						<LuSearch className="absolute left-1 w-10 text-gray-300" fill="none" />

						<input
							type="text"
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
										<Link
											to="/user/my_tickets"
											className="flex flex-row gap-2 text-sm text-center items-center"
										>
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
				<div
					className="w-full h-10 bg-slate-200 px-8
                flex items-center 
                fixed top-16 z-1
                border-b-1 border-slate-500"
				>
					<div className="flex flex-row items-center h-[100%] w-[100%] ml-10">
						<SubHeaderCategories pathname={location.pathname} list={categories} />
					</div>
				</div>
			</header>
		</>
	);
}
