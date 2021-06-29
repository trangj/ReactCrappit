import React from "react";
import SkeletonList from "../../components/utils/SkeletonList";
import AlertStatus from "../../components/utils/AlertStatus";
import { Container, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import Link from "next/link";
import useTopics from "../../hooks/topic-query/useTopics";
import LinkCard from "../../components/utils/LinkCard";

const AllTopics = () => {
	const { isLoading, isError, data: topics, error } = useTopics();

	if (isError || error) return <AlertStatus status={error} />;
	if (isLoading || !topics) return <SkeletonList />;

	return (
		<Container>
			{topics.map((topic) => (
				<LinkCard key={topic.title} borderRadius="md" mb="3">
					<Heading>
						<Link passHref href={`t/${topic.title}`}>
							<LinkOverlay>
								t/{topic.title}
							</LinkOverlay>
						</Link>
					</Heading>
					<Text>{topic.description}</Text>
				</LinkCard>
			))}
		</Container>
	);
};

export default AllTopics;