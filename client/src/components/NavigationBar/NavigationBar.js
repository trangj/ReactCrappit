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
	const bg = useColorModeValue("gray.50", "gray.700");
	const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

	return (
		<Box bg={bg} p="2" position="sticky" top="0" zIndex="3" shadow="md">
			<HStack spacing="0">
				<Heading pr="3" display={{ base: "none", md: "block" }}>
					<Link to="/">Crappit</Link>
				</Heading>
				<BrowseMenu user={user} />
				<Spacer />
				<HStack>
					<IconButton icon={icon} onClick={toggleColorMode} />
					{!user ? (
						<>
							<Button as={Link} to="/login">
								Login
							</Button>
							<Button as={Link} to="/register">
								Register
							</Button>
						</>
					) : (
						<UserMenu user={user} logoutUser={logoutUser} />
					)}
				</HStack>
			</HStack>
		</Box>
	);
};

export default NavigationBar;
