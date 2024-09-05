import { Label, TextInput, Select, ToggleSwitch } from 'flowbite-react';
import UploadBox from '../Form/UploadBox';
import Editor from '../Form/Editor';
const EditEventForm = ({ data, categories, setData }) => {
	return (
		<>
			<div className="col-span-1">
				<div className="max-w-md">
					<div className="mb-2 block">
						<Label htmlFor="event_name" value="Tên sự kiện" />
					</div>
					<TextInput
						onChange={(e) => setData({ ...data, event_name: e.target.value })}
						value={data.event_name}
						id="event_name"
						type="text"
						placeholder="Tên sự kiện"
						required
					/>
				</div>
			</div>
			<div className="col-span-1">
				<div className="max-w-md">
					<div className="mb-2 block">
						<Label htmlFor="countries" value="Thể loại" />
					</div>
					<Select
						onChange={(e) => setData({ ...data, category: e.target.value })}
						value={data.category}
						id="countries"
						required
					>
						{categories.map((item, key) => (
							<option value={item._id} key={key}>
								{item.category_name}
							</option>
						))}
					</Select>
				</div>
			</div>
			<div className="col-span-1">
				<div className="max-w-md">
					<div className="mb-2 block">
						<Label htmlFor="occur_date" value="Ngày diễn ra" />
					</div>
					<TextInput
						value={data.occur_date}
						onChange={(e) => setData({ ...data, occur_date: e.target.value })}
						id="occur_date"
						type="date"
						placeholder="Ngày diễn ra"
						required
					/>
				</div>
			</div>
			<div className="col-span-1">
				<div className="grid grid-cols-2 gap-2">
					<div className="col-span-1">
						<div className="mb-2">
							<Label htmlFor="start_time" value="Thời gian băt đầu" />
						</div>
						<TextInput
							value={data.start_time}
							onChange={(e) => setData({ ...data, start_time: e.target.value })}
							id="start_time"
							type="time"
							required
						/>
					</div>
					<div className="col-span-1">
						<div className="mb-2">
							<Label htmlFor="end_time" value="Thời gian kết thúc" />
						</div>
						<TextInput
							value={data.end_time}
							onChange={(e) => setData({ ...data, end_time: e.target.value })}
							id="end_time"
							type="time"
							required
						/>
					</div>
				</div>
			</div>
			<div className="col-span-1">
				<div className="max-w-md">
					<div className="mb-2 block">
						<Label htmlFor="location" value="Địa điểm" />
					</div>
					<TextInput
						onChange={(e) => setData({ ...data, location: e.target.value })}
						value={data.location}
						id="location"
						type="text"
						placeholder="Địa điểm"
						required
					/>
				</div>
			</div>
			<div className="col-span-1">
				<div className="max-w-md">
					<div className="mb-2 block">
						<Label htmlFor="address" value="Địa chỉ" />
					</div>
					<TextInput
						onChange={(e) => setData({ ...data, address: e.target.value })}
						value={data.address}
						id="address"
						type="text"
						placeholder="Địa chỉ"
						required
					/>
				</div>
			</div>
			<div className="col-span-2 mt-5">
				<ToggleSwitch
					checked={data.is_seat_allocation}
					label="Phân bổ chỗ ngồi"
					onChange={() => setData({ ...data, is_seat_allocation: !data.is_seat_allocation })}
				/>
			</div>
			<div className="col-span-2 mt-5">
				<Label htmlFor="banner" value="Banner sự kiện" />
				<UploadBox tag={'banner'} id="banner" setData={setData} data={data} />
			</div>
			<div className="col-span-2 mt-5 text-black-500">
				<Label htmlFor="banner" value="Giới thiệu sự kiện" />
				<Editor tag="introduce" data={data} setData={setData} />
			</div>
		</>
	);
};

export default EditEventForm;
