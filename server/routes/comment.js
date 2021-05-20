// express setup
const express = require("express");
const router = express.Router();
// middleware
const auth = require("../middleware/auth");
// schemas
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @route   POST /api/comment
// @desc    Create a comment
// @access  Private

router.post("/", auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.body.postId });
		if (!post) throw Error("No post");
		const newComment = new Comment({
			author: req.user.username,
			authorId: req.user.id,
			content: req.body.content,
			postId: req.body.postId,
			topic: post.topic,
		});
		const comment = await newComment.save();
		if (!comment) throw Error("No comment");
		post.comments.push(comment);
		await post.save();
		res.status(200).json({
			comment,
			status: { text: "Comment succesfully added", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/comment/:commentid
// @desc    Update a comment
// @access  Private

router.put("/:commentid", auth, async (req, res) => {
	try {
		if (!req.body.content) throw Error("Missing required fields");
		const comment = await Comment.findOneAndUpdate(
			{ _id: req.params.commentid, authorId: req.user.id },
			{ $set: { content: req.body.content, lastEditDate: Date.now() } },
			{ useFindAndModify: false, new: true }
		);
		if (!comment) throw Error("No comment exists or you are not the author");
		res.status(200).json({
			status: { text: "Comment successfully updated", severity: "success" },
			comment,
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   DELETE /api/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete("/:commentid", auth, async (req, res) => {
	try {
		const comment = await Comment.findOneAndUpdate(
			{
				_id: req.params.commentid,
				authorId: req.user.id,
			},
			{
				$set: {
					author: "[deleted]",
					authorId: null,
					content: "[deleted]",
				},
			},
			{ useFindAndModify: false, new: true }
		);
		if (!comment)
			throw Error("Comment does not exist or you are not the author");
		res.status(200).json({
			comment,
			status: { text: "Comment succesfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   PUT /api/comment/:commentid/changevote
// @desc    Change vote on comment
// @access  Private

router.put("/:commentid/changevote", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.commentid });
		if (!comment) throw Error("No comment exists");
		const user = await User.findOne({ _id: req.user.id });
		if (!user) throw Error("No user exists");

		if (req.query.vote == "like") {
			if (comment.likes.includes(req.user.id)) {
				comment.likes.pull(req.user.id);
			} else if (comment.dislikes.includes(req.user.id)) {
				comment.dislikes.pull(req.user.id);
				comment.likes.push(req.user.id);
			} else {
				comment.likes.push(req.user.id);
			}
			await comment.save();
			res.status(200).json({ comment });
		} else if (req.query.vote == "dislike") {
			if (comment.dislikes.includes(req.user.id)) {
				comment.dislikes.pull(req.user.id);
			} else if (comment.likes.includes(req.user.id)) {
				comment.likes.pull(req.user.id);
				comment.dislikes.push(req.user.id);
			} else {
				comment.dislikes.push(req.user.id);
			}
			await comment.save();
			res.status(200).json({ comment });
		}
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/comment/:commentid/reply
// @desc    Add a reply to a comment
// @access  Private

router.post("/:commentid/reply", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne({ _id: req.params.commentid });
		if (!comment) throw Error("No comment");
		const newComment = new Comment({
			author: req.user.username,
			authorId: req.user.id,
			content: req.body.content,
			postId: req.body.postId,
			topic: req.body.topic,
		});
		const reply = await newComment.save();
		if (!reply) throw Error("No reply");
		comment.comments.push(reply);
		await comment.save();

		res.status(200).json({
			reply,
			status: { text: "reply made successfully", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

module.exports = router;
