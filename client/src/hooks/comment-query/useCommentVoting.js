import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function commentVoting({ commentId, vote }) {
	try {
		const res = await axios.put(
			`/api/comment/${commentId}/changevote?vote=${vote}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useCommentVoting(comment) {
	return useMutation(commentVoting, {
		onSuccess: (res) => {
			comment.likes = res.comment.likes;
			comment.dislikes = res.comment.dislikes;
		},
	});
}
