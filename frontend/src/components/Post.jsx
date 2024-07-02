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
import { RiArrowUpDoubleLine } from "react-icons/ri";
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
						<Avatar
							size="md"
							name={user.name}
							src={user?.profilePic}
							cursor="pointer"
							onClick={() => navigate(`/${user.username}`)}
						/>
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
				<Flex
					display={["none", "none", "flex"]}
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
					<Text fontWeight="bold" mb={2} color={textColor}>
						Replies
					</Text>
					{post.replies.length > 0 ? (
						post.replies.map((reply, index) => (
							<Box key={reply._id}>
								{index > 0 && <Divider borderColor={dividerColor} />}
								<Flex
									mb={index === post.replies.length - 1 ? 0 : 4}
									p={4}
									bg={colorMode === "light" ? "white" : "gray.800"}
									borderRadius="md"
									boxShadow="md">
									<Avatar
										size="xs"
										name="Reply User"
										src={reply.userProfilePic}
										mr={2}
									/>
									<Text
										fontSize="sm"
										color={textColor}
										bg={colorMode === "light" ? "white" : "gray.800"}>
										{reply.text}
									</Text>
								</Flex>
							</Box>
						))
					) : (
						<Flex
							direction="column"
							alignItems="center"
							justifyContent="center"
							textAlign="center"
							bg={colorMode === "light" ? "white" : "gray.800"}
							p={4}
							borderRadius="md"
							sx={{
								boxShadow:
									"rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
							}}>
							<Text fontSize="lg" color="gray.500">
								No replies yet.
							</Text>
							<RiArrowUpDoubleLine size="2em" color="gray.500" mt={4} />
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Post;
