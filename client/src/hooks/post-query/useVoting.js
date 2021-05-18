import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function voting({ topic, id, vote }) {
	try {
		const res = await axios.put(
			`/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
export default function useVoting(post) {
	return useMutation(voting, {
		onSuccess: (res) => {
			post.likes = res.post.likes;
			post.dislikes = res.post.dislikes;
		},
	});
}