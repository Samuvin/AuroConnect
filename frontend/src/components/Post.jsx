import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import {
	Box,
	Flex,
	Text,
	useColorMode,
	Divider,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
	const { colorMode } = useColorMode();
	const bgColor = useColorModeValue("gray.100", "#101010");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const dividerColor = useColorModeValue("gray.200", "gray.600");
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user) return null;

	return (
		<Flex direction="column" p={5} bg={bgColor} minH="100px" color={textColor}>
			<Flex direction={["column", "column", "row"]} w="full" gap={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size="md"
						name={user.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size="xs"
								name="John doe"
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left="15px"
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size="xs"
								name="John doe"
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right="-5px"
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size="xs"
								name="John doe"
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left="4px"
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex
					direction="column"
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
					<Flex alignItems="center" mb={4}>
						<Box ml={3}>
							<Text
								fontWeight="bold"
								cursor="pointer"
								onClick={() => navigate(`/${user.username}`)}>
								{user?.username}
							</Text>
							<Text fontSize="sm" color="gray.500">
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
						</Box>
						{currentUser?._id == user._id && (
							<DeleteIcon
								ml="auto"
								cursor="pointer"
								onClick={handleDeletePost}
							/>
						)}
					</Flex>

					<Text mb={4} textAlign="center" fontSize={["sm", "md"]}>
						{post.text}
					</Text>
					<Link to={`/${user.username}/post/${post._id}`}>
						{post.img && (
							<Box
								borderRadius={6}
								overflow="hidden"
								mb={4}
								border="1px solid"
								borderColor="gray.200">
								<Image src={post.img} w="full" />
							</Box>
						)}
					</Link>

					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>

				{/* Divider */}
				<Divider
					orientation="vertical"
					display={["none", "none", "flex"]}
					borderColor={dividerColor}
				/>

				{/* Replies Section */}
			</Flex>
		</Flex>
	);
};

export default Post;
