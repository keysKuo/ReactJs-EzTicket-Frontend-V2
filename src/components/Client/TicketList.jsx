import React, { useState } from 'react';
import { LuTicket } from 'react-icons/lu';

const TicketList = ({ qty, ticket_types, time, data, setData }) => {
	const increaseQty = (type) => {
		if (type.n_stock === 0) {
			return;
		}

		const idx = data.items.findIndex((tp) => tp._id === type._id);
		const updatedData = { ...data };
		// If the type is found, increase the quantity by 1
		if (idx !== -1) {
			if (updatedData.items[idx].qty < type.n_stock) {
				updatedData.items[idx].qty += 1;
				updatedData.temporary_cost += type.price;
				setData(updatedData);
			}
		} else {
			updatedData.items.push({
				_id: type._id,
				ticket_name: type.ticket_name,
				price: type.price,
				qty: 1,
			});
			updatedData.temporary_cost += type.price;
			setData(updatedData);
		}
		// console.log(data)
	};

	const decreaseQty = (type) => {
		const idx = data.items.findIndex((tp) => tp._id === type._id);

		// If the type is found, increase the quantity by 1
		if (idx !== -1) {
			const updatedData = { ...data };
			updatedData.items[idx].qty -= 1;
			if (updatedData.items[idx].qty === 0) {
				updatedData.items = updatedData.items.filter((tp, i) => i !== idx);
			}

			updatedData.temporary_cost -= type.price;
			setData(updatedData);
		}
	};

	return (
		<table className="table w-[100%]">
			<tbody>
				<tr className="table-row border-b border-emerald-300 ">
					<td className="text-md font-medium text-emerald-300 py-2">Thông tin vé</td>

					<td colSpan={5} className="text-sm py-2 text-right text-gray-300">
						{time}
					</td>
				</tr>
				<div className="py-2"></div>
				{ticket_types.map((type, index) => {
					return (
						<tr key={index} className="table-row">
							<td className="py-3 text-sm flex items-center gap-2">
								<LuTicket className="inline" /> {type.ticket_name}
							</td>
							<td colSpan={3} className="px-3 py-3 text-sm text-right">
								{type.price?.toLocaleString('vi-vn')} đ
							</td>
							{qty && (
								<>
									{type.is_selling ? (
										<>
											<td className="py-2 w-24 text-sm text-right">
												<div className="flex flex-row gap-1 items-center justify-center">
													<div
														onClick={() => {
															decreaseQty(type);
														}}
														className="minus-box unselectable w-7 h-7 bg-gray-500 border-2 border-emerald-400 text-center text-base cursor-pointer"
													>
														-
													</div>
													<input
														className="w-10 p-1 text-center text-sm text-black"
														type="number"
														readOnly
														value={
															data.items[data.items.findIndex((tp) => tp._id === type._id)]?.qty || 0
														}
														min={0}
														max={type.n_stock}
													/>
													<button
														onClick={() => {
															increaseQty(type);
														}}
														className="plus-box unselectable w-7 h-7 bg-gray-500 border-2 border-emerald-400 text-center text-base cursor-pointer"
													>
														+
													</button>
												</div>
											</td>
											<td className="py-2 w-24 text-xs text-right">
												<p>[ Còn {type.n_stock} vé ]</p>
											</td>
										</>
									) : (
										<td className="py-2 w-24 text-sm text-center text-red-400">
											<div className="w-full py-1">Hết vé</div>
										</td>
									)}
								</>
							)}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default TicketList;
