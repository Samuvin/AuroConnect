import React, { useState } from "react";
import SuggestedUser from "./SuggestedUser";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	FormControl,
	ModalBody,
	ModalCloseButton,
	Flex,
	Box,
	useDisclosure,
	Input,
	FormLabel,
	Tooltip,
	useColorModeValue,
	Button,
	IconButton,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const color = useColorModeValue("gray.800", "white");
	const hoverBg = useColorModeValue("gray.200", "gray.800");
	const [user, setUser] = useState("");
	const [search, setSearch] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchUser = async () => {
		setLoading(true);
		setError(null);
		setSearch(null);
		try {
			const response = await fetch(`/api/users/profile/${user}`);
			if (!response.ok) {
				throw new Error("User not found");
			}
			const data = await response.json();
			setSearch(data);
		} catch (err) {
			setError(err.message);
		}
		setLoading(false);
	};

	return (
		<>
			<Tooltip label="Search" aria-label="Search Tooltip">
				<IconButton
					onClick={onOpen}
					icon={<FaSearch size="1.3rem" />}
					aria-label="Search"
					variant="ghost"
					size="lg"
					color={color}
					_hover={{ bg: hoverBg }}
				/>
			</Tooltip>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Search User Account</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input
								value={user}
								onChange={(e) => setUser(e.target.value)}
								placeholder="Username"
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={fetchUser}
							isDisabled={!user}>
							Search
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
					{loading && (
						<Flex justify="center" mt={4}>
							<Spinner size="lg" />
						</Flex>
					)}
					{error && (
						<Text color="red.500" textAlign="center" mt={4}>
							{error}
						</Text>
					)}
					{search && (
						<Box m={6}>
							<SuggestedUser user={search} />
						</Box>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default Search;
