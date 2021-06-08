import { useColorModeValue } from "@chakra-ui/color-mode";
import { LinkBox } from "@chakra-ui/react";
import React from "react";

const LinkCard = ({ children, ...props }) => {
	return (
		<LinkBox
			{...props}
			mb="2"
			p="3"
			borderWidth="1px"
			borderRadius="lg"
			borderColor={useColorModeValue("gray.50", "gray.700")}
			backgroundColor={useColorModeValue("gray.50", "gray.700")}
			_hover={{ borderColor: useColorModeValue("black", "white") }}
		>
			{children}
		</LinkBox>
	);
};

export default LinkCard;
