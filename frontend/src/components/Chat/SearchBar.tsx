import { Mode } from "./Chat";
import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ mode } : { mode : Mode}) {

	const [results, setResults] = useState([{} as { name : string}]);
	const [input, setInput] = useState("");

	const fetchData = (value : string) => {
		if (mode === Mode.DM_Mode)
		{
			fetch("https://jsonplaceholder.typicode.com/users")
				.then((response) => response.json())
				.then((json) => {
					const results = json.filter((user : { name : string }) => {
						return (
							value &&
							user &&
							user.name &&
							user.name.toLowerCase().includes(value)
						);
					});
					setResults(results);
				});
		}
	};

	const handleChange = (value : string) => {
		setInput(value);
		fetchData(value);
	}

	return (
		<div className="relative">
			<input
				type="text"
				placeholder="Search..."
				className="searchInput"
				value={input}
				onChange={(e) => handleChange(e.target.value)}
			/>
			<div className="absolute">
				{results.map((result, id) => {
					return <div key={id}>{result.name}</div>
				})}
			</div>
		</div>
	);
}
