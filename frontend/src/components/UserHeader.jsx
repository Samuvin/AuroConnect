import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack
			gap={4}
			alignItems={"start"}
			w={"full"}
			p={4}
			bg="gray.700"
			borderRadius="lg">
			<Flex justifyContent={"space-between"} w={"full"} alignItems="center">
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"} color="white">
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"} color="gray.400">
							{user.username}
						</Text>
						<Text
							fontSize={"xs"}
							bg={"gray.600"}
							color={"gray.300"}
							p={1}
							borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic ? (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					) : (
						<Avatar
							name={user.name}
							src="https://bit.ly/broken-link"
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text color="gray.300">{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to="/update">
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"} alignItems="center">
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.300"}>{user.followers.length} followers</Text>
					<Box w="1" h="1" bg={"gray.300"} borderRadius={"full"}></Box>
					<Link color={"gray.300"}>instagram.com</Link>
				</Flex>
				<Flex>
					<Box className="icon-container" mx={2}>
						<BsInstagram size={24} cursor={"pointer"} color="white" />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} color="white" />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.800"}>
									<MenuItem
										bg={"gray.800"}
										onClick={copyURL}
										_hover={{ bg: "gray.700" }}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
