import { useEffect, useState } from "react";
import EditForm from "../../../components/Admin/EditForm";
import axios from "axios";




export default function UpdateBusinessTab() {
    const [formData, setFormData] = useState({
        business_name: '',
        business_type: '',
        tax_no: '',
        contact: '',
        hotline: '',
        location: ''
    })

	const [user, setUser] = useState(() => {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    });


	useEffect(() => {
		const FetchDataBusiness = async () => {
			const options = {
				url: `${process.env.REACT_APP_API_URL}/api/business/detail/${user.business}`,
				method: 'GET'
			}

			await axios.request(options)
				.then(response => {
					const result = response.data;

					if(result.success) {
						setFormData(result.business)
					}

					console.log(result);
				})
				.catch(err => {
					console.log(err);
				})	
		}

		FetchDataBusiness();
	}, [])


    const handleSubmit = () => {
        console.log(formData);
    }

	return (
		<>
			<section className="px-6 py-4 mt-[-10px]">
				<div className="flex items-center justify-between mb-10">
					<div className="grow">
						<div className="relative pt-2">
							<h1 className="text-2xl whitespace-nowrap">
								Cập nhật tổ chức
							</h1>
						</div>
						<p className="whitespace-nowrap overflow-hidden text-xs text-gray-400 ">
							API ID: 315F4
						</p>
					</div>

					<div className="pt-4 flex flex-row gap-3">
						{/* <button className="bg-gray-200 w-32 px-4 py-1">
							Unpublish
						</button> */}
						<button onClick={handleSubmit} className="bg-main w-32 px-4 py-1">Lưu</button>
					</div>
				</div>
				<EditForm formData={formData} setFormData={setFormData} inputs={inputs} editstate={true} />
			</section>
		</>
	);
}


const inputs = [
	{
		title: "Tên tổ chức",
		about: "Tên đăng ký kinh doanh của tổ chức",
        tag: 'business_name'
	},
	{
		title: "Loại hình kinh doanh",
		about: "Tên loại hình kinh doanh của tổ chức",
        tag: 'business_type'
	},
	{
		title: "Mã số thuế",
		about: "Mã số khai thuế của tổ chức",
        tag: 'tax_no'
	},
	{
		title: "Liên hệ",
		about: "Email hoặc Fax để liên lạc",
        tag: 'contact'
	},
	{
		title: "Hotline",
		about: "Số điện thoại để liên lạc",
        tag: 'hotline'
	},
	{
		title: "Địa chỉ",
		about: "Địa chỉ kinh doanh của tổ chức",
        tag: 'location'
	},
];