"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ListData() {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [hasPreviousPage, setHasPreviousPage] = useState(false);
	const [searchTitle, setSearchTitle] = useState("");
	const [searchDate, setSearchDate] = useState(null);

	const fetchListItems = async () => {
		let url = `${process.env.NEXT_PUBLIC_API_URI}/list?page=${currentPage}&limit=${limit}&title=${searchTitle}`;
		if (searchDate) {
			console.log("searchDate", searchDate);
			url += `&date=${new Date(searchDate).toLocaleDateString("en-US")}`;
		}
		const res = await axios.get(url);
		console.log("res", res.data.list);
		if (res.status === 200) {
			setData(res.data.list);
			setCurrentPage(res.data.page);
			setLimit(res.data.limit);
			setHasNextPage(res.data.hasNextPage);
			setHasPreviousPage(res.data.hasPreviousPage);
		} else {
			toast.error("Something went wrong");
		}
	};
	useEffect(() => {
		fetchListItems();
	}, [currentPage, searchTitle, searchDate]);

	const onClickNext = () => {
		if (hasNextPage) {
			setCurrentPage(currentPage + 1);
		}
	};

	const onClickPrevious = () => {
		if (hasPreviousPage) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<>
			<div className='flex justify-between'>
				<div>
					<input
						className='border-solid border-2 border-gray-600 border-rounded p-3'
						type='text'
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setSearchTitle(e.target.value);
								return;
							}
						}}
						placeholder='Search here with title...'
					/>
				</div>

				<div>
					<input
						className='border-solid border-2 border-gray-600 border-rounded p-3'
						type='date'
						onChange={(e) => {
							setSearchDate(e.target.value);
							return;
						}}
						placeholder='Filter with date'
						disabled
					/>
				</div>
			</div>
			<div className='flex justify-between m-10 px-2'>
				<div>Image</div>
				<div>Title</div>
				<div>Description</div>
				<div>Quantity</div>
				<div>Price</div>
				<div>Date</div>
			</div>
			{data.map((item) => {
				return (
					<>
						<div className='flex justify-between m-10'>
							<div>
								<img
									src={`${process.env.NEXT_PUBLIC_API_URI}${item.image}`}
									className='w-48'
								/>
							</div>
							<div className='w-24'>{item.title}</div>
							<div className='w-32'>{item.description}</div>
							<div className='w-12'>{item.qty}</div>
							<div className='w-12'>{item.price}</div>
							<div className='w-16'>
								{new Date(item.date).toLocaleDateString()}
							</div>
						</div>
					</>
				);
			})}

			<div className='flex justify-between p-2'>
				<div>
					<button
						className='border-2 border-solid border-gray-600 px-5 py-3 font-semibold text-xl'
						onClick={onClickPrevious}
					>
						Previous
					</button>
				</div>
				<div>
					<button
						className='border-2 border-solid border-gray-600 px-5 py-3 font-semibold text-xl'
						onClick={onClickNext}
					>
						Next
					</button>
				</div>
			</div>
		</>
	);
}
