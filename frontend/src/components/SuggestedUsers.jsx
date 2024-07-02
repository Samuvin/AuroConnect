import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [showToast]);

	return (
		<>
			<Flex
				mt={"1.3rem"}
				direction="column"
				gap={4}
				p={4}
				borderRadius="md"
				sx={{
					boxShadow:
						"rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
				}}
				flex="1"
				mb={4}>
				<Text mb={4} fontWeight={"bold"}>
					Suggested Users
				</Text>
				<Flex direction={"column"} gap={4}>
					{!loading &&
						suggestedUsers.map((user) => (
							<SuggestedUser key={user._id} user={user} />
						))}
					{loading &&
						[0, 1, 2, 3, 4].map((_, idx) => (
							<Flex
								key={idx}
								gap={2}
								alignItems={"center"}
								p={"1"}
								borderRadius={"md"}>
								{/* avatar skeleton */}
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								{/* username and fullname skeleton */}
								<Flex w={"full"} flexDirection={"column"} gap={2}>
									<Skeleton h={"8px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90px"} />
								</Flex>
								{/* follow button skeleton */}
								<Flex>
									<Skeleton h={"20px"} w={"60px"} />
								</Flex>
							</Flex>
						))}
				</Flex>
			</Flex>
		</>
	);
};

export default SuggestedUsers;
