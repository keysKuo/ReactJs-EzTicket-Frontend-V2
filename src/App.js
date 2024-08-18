import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import ClientRoot from './screens/Layouts/ClientRoot';
import SecondRoot from './screens/Layouts/SecondRoot';
import AdminRoot from './screens/Layouts/AdminRoot';
import BaseRoot from './screens/Layouts/BaseRoot';
import BusinessRoot from './screens/Layouts/BusinessRoot';

import {
	HomeScreen,
	EventDetailScreen,
	LoginScreen,
	BookingScreen,
	RegisterScreen,
	OTPScreen,
	SuccessScreen,
	MyTicketScreen,
	SearchEventScreen,
} from './screens/Client';
import { BusinessScreen, AdminScreen, AdminLoginScreen } from './screens/Admin';
import CheckoutScreen from './screens/Client/CheckoutScreen';
import EventListScreen from './screens/Client/EventListScreen';

const router = createBrowserRouter([
	{
		path: '/business',
		element: <BusinessRoot />,
		children: [
			{ path: '/business', element: <BusinessScreen page={'Dashboard'} /> },
			{ path: '/business/info', element: <BusinessScreen page={'Tổ chức'} /> },
			{ path: '/business/events', element: <BusinessScreen page={'Sự kiện'} /> },
			{ path: '/business/ticket', element: <BusinessScreen page={'Vé'} /> },
		],
	},
	{
		path: '/admin',
		element: <AdminRoot />,
		children: [
			{ path: '/admin', element: <AdminScreen page={'Dashboard'} /> },
			{ path: '/admin/events', element: <AdminScreen page={'AproveList'} /> },
			{ path: '/admin/refund', element: <AdminScreen page={'Refund'} /> },
		],
	},
	{
		path: '/admin',
		element: <BaseRoot />,
		children: [{ path: '/admin/login', element: <AdminLoginScreen /> }],
	},
	{
		path: '/',
		element: <ClientRoot />,
		children: [{ path: '/', element: <HomeScreen /> }],
	},
	{
		path: '/',
		element: <SecondRoot />,
		children: [
			{ path: '/event/:event_slug', element: <EventDetailScreen /> },
			{ path: '/event/:event_slug/booking', element: <BookingScreen /> },
			{ path: '/event/:event_slug/booking/:booking_id/checkout', element: <CheckoutScreen /> },
			// { path: "/event/create", element: <CreateEventScreen /> },
			{ path: '/login', element: <LoginScreen /> },
			{ path: '/register', element: <RegisterScreen /> },
			{ path: '/confirm_otp', element: <OTPScreen /> },
			{ path: '/checkout/success', element: <SuccessScreen /> },
			{ path: '/user/my_tickets', element: <MyTicketScreen /> },
			//
			{ path: '/events/:category_slug', element: <EventListScreen /> },
			{ path: '/events/search', element: <SearchEventScreen /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
