import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updateTopic({ topic, formData }) {
	try {
		const res = await axios.put(`/api/index/t/${topic}`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateTopic(setOpenEdit, topic) {
	return useMutation(updateTopic, {
		onSuccess: (res) => {
			topic.description = res.topic.description;
			setOpenEdit(false);
		},
	});
}