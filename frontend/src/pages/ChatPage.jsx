import { SearchIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Input,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	conversationsAtom,
	selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";

const ChatPage = () => {
	const light = useColorModeValue("white", "gray.600");
	const color1 = useColorModeValue("gray.200", "gray.600");
	const hover = useColorModeValue("gray.100", "gray.500");
	const color2 = useColorModeValue("gray.400", "gray.300");
	const color3 = useColorModeValue("gray.600", "gray.400");
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(
		selectedConversationAtom
	);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Flex
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			bg={useColorModeValue("gray.100", "gray.800")}
			px={4}>
			<Flex
				direction={{ base: "column", md: "row" }}
				bg={useColorModeValue("white", "gray.700")}
				boxShadow="lg"
				borderRadius="xl"
				w={{ base: "100%", md: "80%", lg: "1200px" }}
				p={4}
				minHeight="600px" // Set a fixed height for the chat component
			>
				<Flex
					flex={1}
					direction="column"
					maxW={{ sm: "250px", md: "full" }}
					p={4}>
					<Text
						fontWeight="bold"
						color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems="center" mt={4} mb={2}>
							<Input
								placeholder="Search for a user"
								onChange={(e) => setSearchText(e.target.value)}
								variant="filled"
								size="sm"
							/>
							<Button
								ml={2}
								size="sm"
								colorScheme="blue"
								onClick={handleConversationSearch}
								isLoading={searchingUser}
								_hover={{ bg: "blue.500" }}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations
						? [...Array(5)].map((_, i) => (
								<Flex
									key={i}
									mt={4}
									p={2}
									borderRadius="md"
									bg={light}
									_hover={{ bg: hover }}
									cursor="pointer"
									transition="background 0.3s ease">
									<SkeletonCircle size="10" />
									<Box ml={3} flex="1">
										<Skeleton height="10px" />
										<Skeleton height="8px" mt={1} w="70%" />
									</Box>
								</Flex>
						  ))
						: conversations.map((conversation) => (
								<Conversation
									key={conversation._id}
									isOnline={onlineUsers.includes(
										conversation.participants[0]._id
									)}
									conversation={conversation}
									bg={light}
									_hover={{ hover }}
									cursor="pointer"
									transition="background 0.3s ease"
								/>
						  ))}
				</Flex>

				{!selectedConversation._id ? (
					<Flex
						flex={2}
						width={10}
						alignItems="center"
						justifyContent="center"
						p={8}
						borderRadius="xl"
						bg={color1}>
						<Box textAlign="center">
							<GiConversation size={100} color={color2} />
							<Text fontSize="xl" mt={4} color={color3}>
								Select a conversation to start messaging
							</Text>
						</Box>
					</Flex>
				) : (
					<MessageContainer />
				)}
			</Flex>
		</Flex>
	);
};

export default ChatPage;
