import { FileInput, Label } from "flowbite-react";
import { useState } from "react";

export default function UploadBox({ tag, data, setData }) {
	const [uploadedFile, setUploadedFile] = useState('');

	const handleFileChange = (event) => {
        // Get the file from the input
        const file = event.target.files[0];

        if (!file) {
            return; // No file selected
        }
        
		const updatedData = {...data};
		updatedData[tag] = file;
		setData(updatedData);

		setUploadedFile(file.name);
    };

	return (
		<div className="flex w-full items-center justify-center">
			<Label
				htmlFor={`dropzone-file-${tag}`}
				className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
			>
				<div className="flex flex-col items-center justify-center pb-6 pt-5">
					<svg
						className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 16"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLineJoin="round"
							strokeWidth="2"
							d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
						/>
					</svg>
					<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
						<span className="font-semibold">{uploadedFile ? uploadedFile : 'Click to upload or drag and drop'}</span>
						
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						SVG, PNG, JPG or GIF (MAX. 1200x400px)
					</p>
				</div>
				<FileInput onChange={handleFileChange} id={`dropzone-file-${tag}`} className="hidden" />
			</Label>
		</div>
	);
}
