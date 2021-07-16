import React from "react";
import Voting from "./Voting";
import Link from "next/link";
import Image from 'next/image';
import { LinkCard, LinkCardOverlay } from "../../ui";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui";

type Props = {
	post: Post;
};

const PostItem = ({ post, ...props }: Props) => {
	return (
		<LinkCard {...props} className="flex">
			<div className="pb-auto p-1 dark:bg-gray-900">
				<Voting post={post} />
			</div>
			<div className="w-full px-2 pt-2">
				<small>
					<Link passHref href={`/t/${post.topic}`}>
						<a className="font-medium">
							t/{post.topic}
						</a>
					</Link>{" "}
					<div className="text-gray-400 dark:text-gray-400 inline">
						&bull; Posted by{" "}
						<Link passHref href={`/user/${post.author_id}`}>
							<a>
								u/{post.author}
							</a>
						</Link>{" "}
						{dayjs(post.created_at).fromNow()}
					</div>
				</small>
				<h6 className="font-medium">
					<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
						<LinkCardOverlay>
							{post.title}
						</LinkCardOverlay>
					</Link>
				</h6>
				{post.type === "photo" && (
					<Image
						alt={post.image_name}
						src={post.image_url}
						height="600px"
						width="600px"
					/>
				)}
				{post.type === "text" && (
					post.content
				)}
				<div className="flex mt-2 z-10">
					<Link passHref href={`/t/${post.topic}/comments/${post.id}#comments`}>
						<Button variant="ghost" border="rounded" className="text-xs p-2" as="a">
							{post.number_of_comments}
							{post.number_of_comments === 1 ? " Comment" : " Comments"}
						</Button>
					</Link>
				</div>
			</div>
		</LinkCard>
	);
};

export default PostItem;
