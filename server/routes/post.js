// express setup
const express = require("express");
const router = express.Router();
// middleware
const { upload, deleteFile } = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Topic = require("../models/Topic");

// @route   GET /api/post/:id
// @desc    Get a post
// @access  Public

router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id }).populate({
			path: "comments",
		});
		if (!post) throw Error("Could not fetch post");
		res.status(200).json({ post });
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/post
// @desc    Create post
// @access  Private

router.post("/", auth, upload.single("file"), async (req, res) => {
	const newPost = new Post({
		title: req.body.title,
		author: req.user.username,
		authorId: req.user.id,
		content: req.body.content,
		link: req.body.link,
		type: req.body.type,
		topic: req.body.topic,
		imageURL: req.file ? req.file.location : "",
		imageName: req.file ? req.file.key : "",
	});
	try {
		const topic = await Topic.findOne({ title: req.body.topic });
		if (!topic) throw Error("No topic exists");
		const post = await newPost.save();
		if (!post) throw Error("Post could not be made");
		await topic.save();
		res.status(200).json({
			status: { text: "Post successfully created", severity: "success" },
			post,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   DELETE /api/post/:id
// @desc    Delete a post
// @access  Private

router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findOneAndDelete({
			_id: req.params.id,
			authorId: req.user.id,
		});
		if (!post) throw Error("Post does not exist or you are not the author");

		if (post.type === "photo") deleteFile(post.imageName);

		await Comment.deleteMany({ postId: req.params.id });

		res.status(200).json({
			status: { text: "Post successfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/post/:id
// @desc    Update a post
// @access  Private

router.put("/:id", auth, async (req, res) => {
	try {
		if (!req.body.content) throw Error("Missing required fields");
		const post = await Post.findOneAndUpdate(
			{ _id: req.params.id, authorId: req.user.id },
			{ $set: { content: req.body.content, lastEditDate: Date.now() } },
			{ useFindAndModify: false, new: true }
		).populate("comments");
		if (!post)
			throw Error("Post does not exist or you are not the author of the post");
		if (post.type !== "text") throw Error("You can only edit text posts");
		res.status(200).json({
			post,
			status: { text: "Post successfully updated", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/post/:id/changevote
// @desc    Change vote on post
// @access  Private

router.put("/:id/changevote", auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw Error("No post exists");
		const user = await User.findOne({ _id: req.user.id });
		if (!user) throw Error("No user exists");

		if (req.query.vote == "like") {
			if (post.likes.includes(req.user.id)) {
				post.likes.pull(req.user.id);
			} else if (post.dislikes.includes(req.user.id)) {
				post.dislikes.pull(req.user.id);
				post.likes.push(req.user.id);
			} else {
				post.likes.push(req.user.id);
			}
			await post.save();
			res.status(200).json({ post });
		} else if (req.query.vote == "dislike") {
			if (post.dislikes.includes(req.user.id)) {
				post.dislikes.pull(req.user.id);
			} else if (post.likes.includes(req.user.id)) {
				post.likes.pull(req.user.id);
				post.dislikes.push(req.user.id);
			} else {
				post.dislikes.push(req.user.id);
			}
			await post.save();
			res.status(200).json({ post });
		}
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

module.exports = router;
