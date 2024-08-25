import { Button, Modal, TextInput } from 'flowbite-react';

const AddArea = ({ openAddArea, setOpenAddArea }) => {
	return (
		<Modal show={openAddArea} onClose={() => setOpenAddArea(false)}>
			<Modal.Header>Thêm khu vực</Modal.Header>
			<Modal.Body>
				<div className="space-y-6">
					<TextInput placeholder="tên khu vực" required />
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button className="bg-main" onClick={() => setOpenAddArea(false)}>
					Thêm
				</Button>
				<Button color="gray" onClick={() => setOpenAddArea(false)}>
					Hủy bỏ
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddArea;
