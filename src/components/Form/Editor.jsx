import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Editor({ data, setData, tag }) {
	return (
		<CKEditor
			editor={ClassicEditor}
			config={{
				extraPlugins: [MyCustomUploadAdapterPlugin],
				removePlugins: ['SpellChecker'],
			}}
			data={data[tag]}
			onReady={(editor) => {
				editor.editing.view.change((writer) => {
					writer.setAttribute('spellcheck', 'false', editor.editing.view.document.getRoot());
				});
				// You can store the "editor" and use when it is needed.
				// console.log("Editor is ready to use!", editor);
			}}
			onChange={(event, editor) => {
				const updatedData = { ...data };
				updatedData[tag] = editor.getData();
				setData(updatedData);

				// console.log({ event, editor, data });
			}}
			onBlur={(event, editor) => {
				// console.log("Blur.", editor);
			}}
			onFocus={(event, editor) => {
				// console.log("Focus.", editor);
			}}
		/>
	);
}

class MyUploadAdapter {
	constructor(loader) {
		// Lưu trữ tham chiếu đến file loader.
		this.loader = loader;
	}

	// Bắt đầu upload hình ảnh.
	upload() {
		return this.loader.file.then(
			(file) =>
				new Promise((resolve, reject) => {
					this._initRequest();
					this._initListeners(resolve, reject, file);
					this._sendRequest(file);
				}),
		);
	}

	// Khởi tạo XHR request.
	_initRequest() {
		const xhr = (this.xhr = new XMLHttpRequest());
		xhr.open('POST', `${process.env.REACT_APP_API_URL}/api/event/uploadCK`, true);
		xhr.responseType = 'json';
	}

	// Xử lý sự kiện của XHR request.
	_initListeners(resolve, reject, file) {
		const xhr = this.xhr;
		const loader = this.loader;
		const genericErrorText = `Không thể upload hình ảnh: ${file.name}.`;

		xhr.addEventListener('error', () => reject(genericErrorText));
		xhr.addEventListener('abort', () => reject());
		xhr.addEventListener('load', () => {
			const response = xhr.response;
			if (!response || !response.url) {
				return reject(response && response.error ? response.error.message : genericErrorText);
			}
			resolve({
				default: response.url, // Đây phải là URL của hình ảnh sau khi đã upload.
			});
		});

		if (xhr.upload) {
			xhr.upload.addEventListener('progress', (evt) => {
				if (evt.lengthComputable) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			});
		}
	}

	// Gửi request.
	_sendRequest(file) {
		const data = new FormData();
		data.append('uploadImg', file);

		this.xhr.send(data);
	}
}

// Hàm để thêm adapter vào CKEditor.
function MyCustomUploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		return new MyUploadAdapter(loader);
	};
}
