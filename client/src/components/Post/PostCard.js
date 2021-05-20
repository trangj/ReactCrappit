import React, { useContext, useState } from "react";
import DeletePostModerator from "./DeletePostModerator";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { Box, Image, Heading, Text, HStack, Button } from "@chakra-ui/react";

const PostCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Box m="3">
				<HStack spacing="0">
					<Box mb="auto">
						<Voting post={post} />
					</Box>
					<Box width="100%">
						<Text fontSize="xs">
							<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
								t/{post.topic}
							</Link>{" "}
							| Posted by{" "}
							<Link to={`/u/${post.authorId}`}>u/{post.author}</Link>{" "}
							{moment(post.date).fromNow()}
						</Text>
						{post.type === "link" ? (
							<a href={post.link} target="_blank" rel="noopener noreferrer">
								<Heading>{post.title}</Heading>
							</a>
						) : (
							<Heading>{post.title}</Heading>
						)}
						{openEdit ? (
							<UpdatePost
								post={post}
								openEdit={openEdit}
								setOpenEdit={setOpenEdit}
							/>
						) : (
							<>
								{post.type === "text" && <Text mt="1">{post.content}</Text>}
								{post.type === "photo" && (
									<Image
										alt={post.imageName}
										src={post.imageURL}
										maxHeight="400px"
										mx="auto"
										pt="1"
									/>
								)}
								<HStack mt="1">
									{user && user._id === post.authorId && (
										<>
											<DeletePost post={post} />
											{post.type === "text" && (
												<Button
													size="sm"
													variant="ghost"
													onClick={() => setOpenEdit(!openEdit)}
												>
													Edit
												</Button>
											)}
										</>
									)}
									{user &&
										user._id !== post.authorId &&
										user.topicsModerating.includes(post.topic) && (
											<DeletePostModerator post={post} />
										)}
								</HStack>
							</>
						)}
					</Box>
				</HStack>
			</Box>
		</Box>
	);
};

export default PostCard;
