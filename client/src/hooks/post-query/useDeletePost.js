import { useMutation } from "react-query";
import { useHistory } from "react-router";
import axios from "../../axiosConfig";

async function deletePost({ postid }) {
	try {
		const res = await axios.delete(`/api/post/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePost(topic) {
	const history = useHistory();
	return useMutation(deletePost, {
		onSuccess: (res) => {
			history.push(`/t/${topic}`);
		},
	});
}
