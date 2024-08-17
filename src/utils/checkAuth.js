import axios from 'axios';

const checkAuth = async () => {
	const token = localStorage.getItem('accessToken');
	console.log(process.env.REACT_APP_API_URL);
	const options = {
		url: `${process.env.REACT_APP_API_URL}/api/user/test_authentication`,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return await axios
		.request(options)
		.then((response) => {
			const result = response.data;
			console.log(result);
			return true;
		})
		.catch((err) => {
			console.log(err.response.data);
			return false;
		});
};

export default checkAuth;
