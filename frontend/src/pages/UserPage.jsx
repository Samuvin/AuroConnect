import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
	Box,
	Button,
	Flex,
	Spinner,
	Stack,
	Text,
	useColorModeValue,
	Icon,
	VStack,
} from "@chakra-ui/react";
import { MdPersonAdd, MdPersonRemove } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import UserHeader from "../components/UserHeader";
import Post from "../components/Post";
import { Grid, GridItem } from "@chakra-ui/react";
import Followers from "../components/Followers";
const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const bg = useColorModeValue("white", "gray.800");
	const color = useColorModeValue("gray.800", "white");

	const bgColor = useColorModeValue("gray.100", "gray.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		const checkFollowStatus = async () => {
			if (!user) return;
			try {
				const res = await fetch(`/api/users/follow-status/${user}`);
				const data = await res.json();
				setIsFollowing(data.isFollowing);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		const fetchFollowers = async () => {
			if (!user) return;
			try {
				const res = await fetch(`/api/users/followers/${user._id}`);
				const data = await res.json();
				setFollowers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		const fetchFollowing = async () => {
			if (!user) return;
			try {
				const res = await fetch(`/api/users/${username}/following`);
				const data = await res.json();
				setFollowing(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		getPosts();
		// checkFollowStatus();
		fetchFollowers();
		// fetchFollowing();
	}, [username, showToast, setPosts, user]);

	const handleFollowToggle = async () => {
		try {
			const res = await fetch(`/api/users/${username}/follow`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ follow: !isFollowing }),
			});
			const data = await res.json();
			setIsFollowing(data.isFollowing);
			showToast("Success", data.message, "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"} alignItems="center" height="100vh">
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<Box mt={20} p={4} bg={bg} color={color} borderRadius="md" boxShadow="lg">
			<UserHeader user={user} />
			<Flex
				justifyContent="space-between"
				alignItems="center"
				flexDirection={{ base: "column", md: "row" }}
				my={4}>
				<Stack
					direction="row"
					spacing={4}
					alignItems="center"
					mb={{ base: 4, md: 0 }}>
					<Text fontSize="2xl" fontWeight="bold">
						{user.username}
					</Text>
					<Text fontSize="md" color="gray.500">
						{user.bio}
					</Text>
				</Stack>
				<Button
					leftIcon={<Icon as={isFollowing ? MdPersonRemove : MdPersonAdd} />}
					colorScheme={isFollowing ? "red" : "teal"}
					onClick={handleFollowToggle}>
					{isFollowing ? "Unfollow" : "Follow"}
				</Button>
			</Flex>
			<Grid templateColumns="repeat(3, 1fr)" gap={6}>
				<GridItem w="100%" h="100%">
					<Box textAlign="center" mb={{ base: 4, md: 0 }}>
						<Text fontSize="lg" fontWeight="bold">
							{user.postsCount}
						</Text>
						<Text
							m={2}
							fontSize="lg"
							fontWeight="bold"
							textAlign={"center"}
							color="gray.500">
							Posts
						</Text>
						<VStack spacing={4} mt={5}>
							{posts.map((post) => (
								<Post key={post._id} post={post} postedBy={post.postedBy} />
							))}
						</VStack>
					</Box>
				</GridItem>
				<GridItem w="100%" h="100%">
					<Text
						m={2}
						fontSize="lg"
						fontWeight="bold"
						textAlign={"center"}
						color="gray.500">
						{followers.length} Followers
					</Text>
					<Flex
						direction="column"
						p={5}
						bg={bgColor}
						minH="100px"
						color={textColor}
						spacing={4}
						mt={5}>
						<Followers id={"666a8c59e1875745d998ca2d"} />
						<Followers id={"666a8c59e1875745d998ca2d"} />
						<Followers id={"666a8c59e1875745d998ca2d"} />
					</Flex>
				</GridItem>
				<GridItem w="100%" h="100%">
					<Box textAlign="center">
						<Button variant="link">
							<Text fontSize="lg" fontWeight="bold">
								{following.length}
							</Text>
							<Text fontSize="md" color="gray.500">
								Following
							</Text>
						</Button>
					</Box>
				</GridItem>
			</Grid>
			{!fetchingPosts && posts.length === 0 && (
				<Flex justifyContent="center" my={12}>
					<Text fontSize="xl" color="gray.500">
						User has no posts.
					</Text>
				</Flex>
			)}
			{fetchingPosts && (
				<Flex justifyContent="center" my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}
		</Box>
	);
};

export default UserPage;
