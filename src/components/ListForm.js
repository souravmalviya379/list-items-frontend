"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function ListForm() {
	const schemaValidation = yup.object({
		title: yup
			.string()
			.required("title must not be empty")
			.min(3, "title must contain atleast 3 characters"),
		description: yup
			.string()
			.required("description must not be empty")
			.min(10, "description must contain atleast 10 characters")
			.max(250, "description must not contain more than 250 characters"),
		qty: yup
			.number()
			.typeError("qty must be a number")
			.positive("qty must be a positive number")
			.integer("qty must be an integer")
			.required("qty is required"),
		price: yup
			.number()
			.typeError("Price must be a number")
			.positive("Price must be a positive number")
			.required("Price is required"),
		date: yup
			.string('date must be valid date string "mm-dd-yyyy" format')
			.required("date is required"),
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schemaValidation) });
	const [backendErrorMessages, setBackendErrorMessages] = useState([]);

	const onSubmit = async (formData) => {
		try {
			console.log("formData", formData.image[0]);
			formData.image = formData.image[0];
			// formData.date = `${new Date(formData.date).getMonth()}/${new Date(
			// 	formData.date
			// ).getDate()}/${new Date(formData.date).getFullYear()}`;
			// console.log("formData.date", formData.date);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URI}/list/add`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			console.log("response", response);
			if (response.status === 201) {
				toast.success("ListItem inserted into list successfully");
			}
		} catch (error) {
			console.error("Error:", error);
			if ((error.response.data.message = "Validation errors")) {
				error.response.data?.errorMessages.map((e) => {
					if (e.image) {
						toast.error(e.image);
					} else if (e.title) {
						toast.error(e.title);
					} else if (e.description) {
						toast.error(e.description);
					} else if (e.date) {
						toast.error(e.date);
					} else if (e.qty) {
						toast.error(e.qty);
					} else if (e.price) {
						toast.error(e.price);
					}
				});
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<div>
						<input
							placeholder='ListItem image'
							type='file'
							{...register("image")}
						/>
						{errors.image && <span>{errors.image.message}</span>}
					</div>
					<div>
						<input
							type='text'
							placeholder='title'
							{...register("title")}
						/>
						{errors.title && <span>{errors.title.message}</span>}
					</div>
					<div>
						<input
							{...register("description")}
							placeholder='description ...'
						/>
						{errors.description && <span>{errors.description.message}</span>}
					</div>
					<div>
						<input
							placeholder='price'
							type='number'
							{...register("price")}
						/>
						{errors.price && <span>{errors.price.message}</span>}
					</div>
					<div>
						<input
							placeholder='qty'
							type='number'
							{...register("qty")}
						/>
						{errors.qty && <span>{errors.qty.message}</span>}
					</div>
					<div>
						<input
							placeholder='date'
							type='text'
							{...register("date")}
						/>
						{errors.date && <span>{errors.date.message}</span>}
					</div>
				</div>

				<button
					type='submit'
					className='border-gray-800 font-bold border-solid border-2 m-3 py-2 px-5 text-xl'
				>
					Save
				</button>
			</form>
		</div>
	);
}
