import ListData from "@/components/ListData";
import ListForm from "@/components/ListForm";

export default function Home() {
	return (
		<>
			<ListForm />

			<hr className='m-10 w-2' />

			<ListData />
		</>
	);
}
