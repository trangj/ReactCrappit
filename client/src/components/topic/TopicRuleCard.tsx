import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import React from "react";
import { Topic } from "src/types/entities/topic";
import { Card } from "src/ui/Card";
import { Divider } from "src/ui/Divider";

type TopicRuleCardProps = {
	topicData: Topic;
};

const TopicRuleCard = ({ topicData }: TopicRuleCardProps) => {
	return (
		<Card className="p-3 flex flex-col">
			<div className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-3">
				t/{topicData.title} Rules
			</div>
			{topicData?.rules.map((rule, i) => (
				<Disclosure as="div" key={i}>
					{({ open }) => (
						<>
							<Disclosure.Button className="font-medium py-2 w-full flex items-center text-sm">
								<span>
									{i + 1}. {rule.name}
								</span>
								{open ? (
									<ChevronUpIcon className="h-4 w-4 ml-auto" />
								) : (
									<ChevronDownIcon className="h-4 w-4 ml-auto" />
								)}
							</Disclosure.Button>
							<Disclosure.Panel as="div" className="content px-4 pb-2">
								{rule.description}
							</Disclosure.Panel>
							{i !== topicData.rules.length - 1 && <Divider />}
						</>
					)}
				</Disclosure>
			))}
		</Card>
	);
};

export default TopicRuleCard;