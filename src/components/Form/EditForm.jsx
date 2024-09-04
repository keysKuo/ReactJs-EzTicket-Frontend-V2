import { HiCode, HiCog, HiCheck } from 'react-icons/hi';
import UploadBox from './UploadBox';
import Editor from './Editor';
import Input from './Input';
import Select from './Select';
import { useEffect, useState } from 'react';
import { ToggleSwitch } from 'flowbite-react';

export default function EditForm({ inputs, data, setData, editstate, categories }) {
	const [selectedValue, setSelectedValue] = useState(categories[0]?._id); // Giá trị được chọn mặc định

	return (
		<>
			{inputs &&
				inputs.map((input, index) => {
					switch (input.type) {
						case 'select':
							return (
								<div key={index} className="col-span-1">
									<label className="block mb-2 text-sm font-medium">{input.title}</label>
									<div className="relative bg-gray-200 rounded">
										<Select
											onChange={(e) => {
												const updatedData = { ...data };
												updatedData[input.tag] = e.target.value;
												setData(updatedData);
											}}
											value={data.category || selectedValue}
											options={
												categories
													? categories.map((item) => {
															return {
																value: item._id,
																name: item.category_name,
															};
													  })
													: []
											}
											key={index}
										/>
									</div>
									<p className="text-xs text-gray-400 pt-2">{input.about}</p>
								</div>
							);
						case 'switch':
							return (
								<div key={index} className="col-span-2 mt-5">
									<ToggleSwitch checked={input.checked} label="Phân bổ chỗ ngồi" onChange={input.onChange} />
								</div>
							);
						case 'textarea':
							return (
								<div key={index} className="col-span-2 mt-5">
									<label className="block mb-2 text-sm font-medium">{input.title}</label>
									<Editor key={index} tag={input.tag} data={data} setData={setData} />
								</div>
							);

						case 'file':
							return (
								<div key={index} className="col-span-2 mt-5">
									<label className="block mb-2 text-sm font-medium">{input.title}</label>
									<UploadBox tag={input.tag} data={data} setData={setData} key={index} />
								</div>
							);
						default:
							return (
								<div key={index} className="col-span-1">
									<label className="block mb-2 text-sm font-medium">{input.title}</label>
									<div className="relative bg-gray-200 rounded">
										<Input
											onChange={(e) => {
												const updatedData = { ...data };
												updatedData[input.tag] = e.target.value;
												setData(updatedData);
											}}
											value={data[input.tag]}
											key={index}
											type={input.type}
										/>
									</div>
									<p className="text-xs text-gray-400 pt-2">{input.about}</p>
								</div>
							);
					}
				})}
		</>
	);
}
