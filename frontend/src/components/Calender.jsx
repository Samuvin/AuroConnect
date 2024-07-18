import { useState, useEffect } from "react";
import axios from "axios";
import {
	Flex,
	Button,
	Text,
	Box,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useDisclosure,
	ModalCloseButton,
} from "@chakra-ui/react";
import { FaBell, FaAngleDoubleDown } from "react-icons/fa";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";

const Calendar = () => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const [contestByMonth, setContestByMonth] = useState({});
	const [selectedContest, setSelectedContest] = useState(null); // Holds contest details
	const [empty, setEmpty] = useState(true);
	const [user] = useRecoilState(userAtom);
	const [currentPage, setCurrentPage] = useState(0); // Track current page of contests
	const [hasMore, setHasMore] = useState(true); // Track if there are more contests to fetch
	const pageSize = 20; // Number of contests per page

	const username = "samuvin";
	const apiKey = "ef448e68721775fa1129b1ae4bdf09ea018ef7cf";
	const currentDate = new Date().toISOString(); // Get current date in ISO 8601 format
	const url = `https://clist.by/api/v1/contest/?username=${username}&api_key=${apiKey}&upcoming=true&format_time=true&order_by=start`;

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		generateCalendar();
	}, [currentPage]); // Fetch contests whenever currentPage changes

	const handleButtonClick = (contest) => {
		setSelectedContest(contest);
		onOpen();
	};

	const formatDateTimeToIST = (isoString) => {
		const date = new Date(isoString);
		date.setUTCHours(date.getUTCHours() + 5);
		date.setUTCMinutes(date.getUTCMinutes() + 30);

		const options = {
			timeZone: "Asia/Kolkata",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};

		return date.toLocaleString("en-IN", options);
	};

	const generateCalendar = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${url}&start__gt=${currentDate}&limit=${pageSize}&offset=${
					currentPage * pageSize
				}`
			);
			const data = response.data;

			const contestsByMonth = {};
			data.objects.forEach((contest) => {
				const startTime = new Date(contest.start);
				const monthYear = `${startTime.getFullYear()}-${String(
					startTime.getMonth() + 1
				).padStart(2, "0")}`;
				if (!contestsByMonth[monthYear]) {
					contestsByMonth[monthYear] = [];
				}
				contestsByMonth[monthYear].push(contest);
			});

			// Merge new contests with existing contestsByMonth state
			setContestByMonth((prevContestByMonth) => {
				const updatedContests = { ...prevContestByMonth };

				Object.keys(contestsByMonth).forEach((key) => {
					if (updatedContests[key]) {
						updatedContests[key] = [
							...updatedContests[key],
							...contestsByMonth[key],
						];
					} else {
						updatedContests[key] = contestsByMonth[key];
					}
				});

				return updatedContests;
			});

			// Check if there are more contests to fetch
			if (data.meta.next === null) {
				setHasMore(false);
			}

			setEmpty(false);
		} catch (error) {
			console.error("Error fetching contest data:", error);
		} finally {
			setLoading(false);
		}
	};

	const mailto = async () => {
		try {
			const data = await fetch("/api/mail/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...selectedContest, email: user.email }),
			});
			const response = await data.json();
			showToast("Success", response.message, "success");
		} catch (err) {
			console.log(err);
		}
	};

	const handleLoadMore = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	return (
		<>
			{Object.entries(contestByMonth).map(([monthYear, contests]) => (
				<Flex key={monthYear} flexDirection="column" gap={2}>
					<Text>{monthYear}</Text>
					<Box m={2}>
						{contests.map((contest, index) => (
							<Box
								key={`${contest.id}-${index}`} // Ensure key is unique
								ml={2}
								onClick={() => handleButtonClick(contest)}
								cursor="pointer"
								borderWidth="1px"
								borderRadius="lg"
								p={2}
								mb={2}
								_hover={{ backgroundColor: "gray.100" }}>
								{contest.event}
							</Box>
						))}
					</Box>
				</Flex>
			))}
			{hasMore && (
				<Button
					onClick={handleLoadMore}
					disabled={loading}
					leftIcon={<FaAngleDoubleDown />}
					isLoading={loading}
					loadingText="Loading...">
					Load More Contests
				</Button>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Contest Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedContest && (
							<div>
								<Text>Name: {selectedContest.event}</Text>
								<Text>
									Start Date: {formatDateTimeToIST(selectedContest.start)}
								</Text>
								<Text>
									End Date: {formatDateTimeToIST(selectedContest.end)}
								</Text>
								<Text>Duration: {selectedContest.duration / 3600} Hours</Text>
								<Text>Host: {selectedContest.resource.name}</Text>
							</div>
						)}
						<Button mt={2} onClick={mailto}>
							<FaBell /> Notify Me
						</Button>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme="green">
							<a
								href={selectedContest?.href}
								target="__blank"
								rel="noopener noreferrer">
								Open Contest
							</a>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Calendar;
