import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import { LuTicket } from 'react-icons/lu';

const TicketList = ({ qty, ticket_types, data, setData, is_seat_allocation, handleOnclick }) => {
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
		<>
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
										{!is_seat_allocation && (
											<td className="py-2 w-24 text-sm text-right">
												<div className="flex flex-row gap-1 items-center justify-center">
													<button
														onClick={() => {
															decreaseQty(type);
														}}
														className="minus-box unselectable w-7 h-7 bg-gray-500 border-2 border-emerald-400 text-center text-base cursor-pointer"
													>
														-
													</button>
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
										)}

										<td className="py-2 w-24 text-xs text-right mr-5">
											<p>[ Còn {type.n_stock} vé ]</p>
										</td>

										{is_seat_allocation && (
											<td className="py-2 w-24 text-xs text-right mr-5">
												<Button
													onClick={() =>
														handleOnclick(type.ticket_map, type._id, type.price, type.ticket_name)
													}
													className="bg-main"
													size={'xs'}
												>
													Chọn
												</Button>
											</td>
										)}
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
		</>
		// 	</tbody>
		// </table>
	);
};

export default TicketList;
