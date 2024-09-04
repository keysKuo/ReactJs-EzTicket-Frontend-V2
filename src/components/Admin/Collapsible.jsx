import React, { useState } from 'react';

const Collapsible = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapse = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="px-4 py-2 border border-gray-200 ">
			<button onClick={toggleCollapse} className="flex items-center justify-between w-full text-left">
				<span className="text-xs">Danh sách vé</span>

				<div className="flex flex-row gap-2">
					{isOpen && <span className="text-xs text-emerald-300">Số lượng: 20</span>}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-4 w-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						style={{ transition: 'transform 0.3s' }}
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</button>
			{isOpen && (
				<div className="mt-4 flex flex-row items-center gap-3">
					<div className="my-3">
						<label className="block mb-2 text-xs font-medium">Tên vé</label>
						<input className="w-full h-[2rem] px-3 outline-none focus:ring-0 border border-gray-200 text-xs" />
					</div>
					<div className="my-3">
						<label className="block mb-2 text-sm font-medium">Giá</label>
						<input className="w-full h-[2rem] px-3 outline-none focus:ring-0 border border-gray-200 text-sm" />
					</div>
				</div>
			)}
		</div>
	);
};

export default Collapsible;
