import { Sidebar, CustomFlowbiteTheme } from 'flowbite-react';
import { useState } from 'react';
import { HiArchive, HiInbox, HiLockClosed, HiLogout, HiShare, HiTicket, HiViewBoards } from 'react-icons/hi';
import { MdDashboard, MdEvent, MdMonitor } from 'react-icons/md';
import { Link, useHref, useNavigate } from 'react-router-dom';

export default function BusinessSideNav() {
    const navigate = useNavigate();
    const [navActive, setNavActive] = useState(1);
    const href = useHref();
    console.log(href)
    // console.log(navActive)
    return (
        <Sidebar theme={customTheme}>
            <Sidebar.Logo img={process.env.REACT_APP_LOGO_URL} imgAlt="EzTicket logo">
                EzTicket
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="/" icon={MdMonitor}>
                        Trang chủ
                    </Sidebar.Item>

                    <Sidebar.Item className={href === '/admin' && 'bg-main'} icon={MdDashboard}>
                        <Link
                            className="w-full block"
                            to="/admin"
                        >
                            Dashboard
                        </Link>
                    </Sidebar.Item>

                    <Sidebar.Item className={href === '/admin/events' && 'bg-main'} icon={MdEvent}>
                        <Link
                            className="w-full block"
                            to="/admin/events"
                        >
                            Phê duyệt sự kiện
                        </Link>
                    </Sidebar.Item>

                    <Sidebar.Item className={href === '/admin/help' && 'bg-main'} icon={HiInbox}>
                        <Link
                            className="w-full block"
                            to=""
                        >
                            Yêu cầu hỗ trợ
                        </Link>
                    </Sidebar.Item>

                    <Sidebar.Item className={href === '/admin/refund' && 'bg-main'} icon={HiViewBoards}>
                        <Link
                            className="w-full block"
                            to="/admin/refund"
                        >
                            Yêu cầu hoàn tiền
                        </Link>
                    </Sidebar.Item>

                    <Sidebar.Item className="cursor-pointer" icon={HiLockClosed}>
                        Chính sách
                    </Sidebar.Item>
                    <Sidebar.Item className="cursor-pointer" icon={HiShare}>
                        Dịch vụ
                    </Sidebar.Item>

                    {/* <Sidebar.Item className={navActive === 4 && 'bg-main'} icon={HiTicket}>
                        <Link
                            onClick={() => {
                                setNavActive(4);
                            }}
                            className="w-full block"
                            to="/business/ticket"
                        >
                            Vé vào cổng
                        </Link>
                    </Sidebar.Item> */}
                    <Sidebar.Item onClick={() => {
                        localStorage.clear();
                        navigate('/admin/login')
                    }} icon={HiLogout}>
                        Đăng xuất
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

const customTheme = {
    root: {
        base: 'h-full',
        collapsed: {
            on: 'w-16',
            off: 'w-64',
        },
        inner: 'h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-4 px-3 dark:bg-gray-800',
    },
    logo: {
        base: 'mb-5 flex items-center pl-2.5',
        collapsed: {
            on: 'hidden',
            off: 'self-center whitespace-nowrap text-xl font-semibold dark:text-white',
        },
        img: 'mr-4 h-12 w-12',
    },
};
