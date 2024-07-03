import {
	Box,
	Flex,
	Spinner,
	Button,
	Text,
	useColorModeValue,
	Avatar,
	useColorMode,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Followers = ({ id }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const bgColor = useColorModeValue("gray.100", "gray.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const { colorMode } = useColorMode();
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`/api/users/profile/${id}`);
				const follower = await response.json();
				console.log(follower);
				if (follower) {
					setUser(follower);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [id]);

	if (loading) {
		return (
			<Flex
				direction="column"
				p={5}
				bg={bgColor}
				minH="100px"
				color={textColor}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user) {
		return <Text>No user data found</Text>;
	}

	return (
		<Flex direction={["column", "column", "row"]} w="full" gap={5}>
			<Flex
				direction="row"
				gap={4}
				p={4}
				bg={colorMode === "light" ? "white" : "gray.800"}
				borderRadius="md"
				sx={{
					boxShadow:
						"rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
				}}
				flex="1"
				mb={4}>
				<Flex>
					<Flex>
						<Avatar src={user.profilePic} m={2} />
						<Text fontWeight="bold" cursor="pointer">
							{user?.username}
						</Text>
						<Text fontSize="sm" color="gray.500">
							{user?.name}
						</Text>
					</Flex>
					<Flex>
						<Button alignSelf={"flex-end"}> Follow</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Followers;
