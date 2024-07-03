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
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@chakra-ui/react";
import { MdPersonAdd, MdPersonRemove } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import UserHeader from "../components/UserHeader";
import Post from "../components/Post";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [modalContent, setModalContent] = useState([]);

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
				const res = await fetch(`/api/users/${username}/follow-status`);
				const data = await res.json();
				setIsFollowing(data.isFollowing);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		const fetchFollowers = async () => {
			if (!user) return;
			try {
				const res = await fetch(`/api/users/${username}/followers`);
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
		checkFollowStatus();
		fetchFollowers();
		fetchFollowing();
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

	const handleShowFollowers = () => {
		setModalContent(followers);
		onOpen();
	};

	const handleShowFollowing = () => {
		setModalContent(following);
		onOpen();
	};

	const bg = useColorModeValue("white", "gray.800");
	const color = useColorModeValue("gray.800", "white");

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
			<Flex
				justifyContent="space-around"
				my={4}
				flexDirection={{ base: "column", md: "row" }}>
				<Box textAlign="center" mb={{ base: 4, md: 0 }}>
					<Text fontSize="lg" fontWeight="bold">
						{user.postsCount}
					</Text>
					<Text fontSize="md" color="gray.500">
						Posts
					</Text>
				</Box>
				<Box textAlign="center" mb={{ base: 4, md: 0 }}>
					<Button variant="link" onClick={handleShowFollowers}>
						<Text fontSize="lg" fontWeight="bold">
							{user.followersCount}
						</Text>
						<Text fontSize="md" color="gray.500">
							Followers
						</Text>
					</Button>
				</Box>
				<Box textAlign="center">
					<Button variant="link" onClick={handleShowFollowing}>
						<Text fontSize="lg" fontWeight="bold">
							{user.followingCount}
						</Text>
						<Text fontSize="md" color="gray.500">
							Following
						</Text>
					</Button>
				</Box>
			</Flex>
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
			<Stack spacing={4}>
				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Stack>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{modalContent === followers ? "Followers" : "Following"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{modalContent.map((person) => (
							<Flex key={person._id} alignItems="center" my={2}>
								<Box mr={4}>
									<Avatar
										name={person.username}
										src={person.avatar}
										size="sm"
									/>
								</Box>
								<Text>{person.username}</Text>
							</Flex>
						))}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default UserPage;
