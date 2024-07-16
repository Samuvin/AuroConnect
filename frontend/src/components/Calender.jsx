import { useState } from "react";
import axios from "axios";
import { Flex } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { FaAngleDoubleDown } from "react-icons/fa";
import useShowToast from "../hooks/useShowToast";
import {
	Modal,
	ModalOverlay,
	Button,
	ModalContent,
	ModalHeader,
	ModalFooter,
	UnorderedList,
	ListItem,
	ModalBody,
	Text,
	useDisclosure,
	ModalCloseButton,
} from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
const Calendar = () => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const [contestByMonth, setContestByMonth] = useState({});
	const [selectedContest, setSelectedContest] = useState(null); // Changed to hold contest details
	const [empty, setempty] = useState(true);
	const [user, setUser] = useRecoilState(userAtom);
	const username = "samuvin";
	const apiKey = "ef448e68721775fa1129b1ae4bdf09ea018ef7cf";
	const url = `https://clist.by/api/v1/contest/?username=${username}&api_key=${apiKey}&upcoming=true`;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleButtonClick = (contest) => {
		setSelectedContest(contest);
		onOpen();
	};
	const formatDateTimeToIST = (isoString) => {
		const date = new Date(isoString); // Parse ISO 8601 string to Date object (UTC time)

		date.setUTCHours(date.getUTCHours() + 5);
		date.setUTCMinutes(date.getUTCMinutes() + 30);

		const options = {
			timeZone: "Asia/Kolkata", // Set the time zone to IST
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};

		return date.toLocaleString("en-IN", options); // Use 'en-IN' for Indian locale
	};

	const generateCalendar = async () => {
		setLoading(true);

		try {
			const response = await axios.get(url);
			const data = response.data;
			const now = new Date();
			const contestsByMonth = {};
			data.objects.forEach((contest) => {
				const startTime = new Date(contest.start);
				if (startTime > now) {
					const monthYear = `${startTime.getFullYear()}-${String(
						startTime.getMonth() + 1
					).padStart(2, "0")}`;
					if (!contestsByMonth[monthYear]) {
						contestsByMonth[monthYear] = [];
					}
					contestsByMonth[monthYear].push(contest);
				}
			});
			setContestByMonth(contestsByMonth);
			setempty(false);
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
	return (
		<>
			{empty && (
				<button onClick={generateCalendar} disabled={loading}>
					<FaAngleDoubleDown />
					{loading && <h1>Loading....</h1>}
				</button>
			)}
			{Object.entries(contestByMonth).map(([monthYear, contests]) => (
				<Flex key={monthYear} flexDirection="column" gap={2}>
					<Text>{monthYear}</Text>
					<UnorderedList spacing={3} m={2}>
						{contests.map((contest) => (
							<ListItem
								ml={2}
								key={contest.id}
								onClick={() => handleButtonClick(contest)}
								cursor="pointer">
								{contest.event}
							</ListItem>
						))}
					</UnorderedList>
				</Flex>
			))}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Contest Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedContest && (
							<div>
								<p>Name: {selectedContest.event}</p>
								<p>Start Date: {formatDateTimeToIST(selectedContest.start)}</p>
								<p>End Date: {formatDateTimeToIST(selectedContest.end)}</p>
								<p>Duration: {selectedContest.duration / 3600} Hours</p>
								<p>Host: {selectedContest.resource.name}</p>
							</div>
						)}
						<Button mt={2} onClick={mailto}>
							<FaBell />
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
