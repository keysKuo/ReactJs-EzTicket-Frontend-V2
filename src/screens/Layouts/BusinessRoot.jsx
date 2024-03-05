import axios from "axios";
import BusinessSideNav from "../../components/Admin/BusinessSideNav";
import AdminSideNav from "../../components/Admin/AdminSideNav";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { checkAuth } from "../../utils";

export default function BusinessRoot() {
	useEffect(() => {
		const checkAuthAsync = async () => {
			const isAuth = await checkAuth();
			
			if(!isAuth) {
				localStorage.clear();
				window.location.href = '/login';
			}
		}
		
		checkAuthAsync();

	}, [])
	return (
		<>
			<div className="flex min-h-screen">
				{/* Sidebar */}
				<aside className="w-64">
                    <BusinessSideNav />

				</aside>

				{/* Content Area */}
				<div className="flex-1 flex flex-col">
				
					{/* Main Content */}
					<main className="flex-1 bg-gray-100 text-white overflow-auto">
						<Outlet />
					</main>

					{/* Footer */}
				</div>
			</div>

			{/* Footer */}
		</>
	);
}