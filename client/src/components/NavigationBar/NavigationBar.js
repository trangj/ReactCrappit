import React, { useContext } from "react";
import {
	Box,
	IconButton,
	Spacer,
	Button,
	Heading,
	HStack,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import UserMenu from "./UserMenu";
import BrowseMenu from "./BrowseMenu";

const NavigationBar = () => {
	const { logoutUser, user } = useContext(UserContext);
	const { toggleColorMode } = useColorMode();
	const bg = useColorModeValue("white", "gray.700");
	const border = useColorModeValue("gray.200", "gray.600");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

	return (
		<Box
			bg={bg}
			p="2"
			position="sticky"
			top="0"
			zIndex="3"
			borderBottom="1px"
			borderColor={border}
		>
			<HStack spacing="0">
				<Heading pr="3" display={{ base: "none", sm: "block" }}>
					<Link to="/">Crappit</Link>
				</Heading>
				<BrowseMenu user={user} />
				<Spacer />
				<div>
					<IconButton icon={icon} onClick={toggleColorMode} mr="2" />
					{!user ? (
						<>
							<Button as={Link} to="/login" mr="2">
								Login
							</Button>
							<Button as={Link} to="/register">
								Register
							</Button>
						</>
					) : (
						<UserMenu user={user} logoutUser={logoutUser} />
					)}
				</div>
			</HStack>
		</Box>
	);
};

export default NavigationBar;
