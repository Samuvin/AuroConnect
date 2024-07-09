import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import {
	Button,
	Text,
	Flex,
	Box,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import feedAtom from "../atoms/feedAtom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	let feedsort = useSetRecoilState(feedAtom);
	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?"))
			return;
		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	const handlesort = (value) => {
		feedsort(value);
	};
	return (
		<>
			<Flex flexDirection={"column"} gap={6} marginLeft={5}>
				<Box>
					<Text my={1} fontWeight={"bold"}>
						Freeze Your Account
					</Text>
					<Text my={1}>
						You can unfreeze your account anytime by logging in.
					</Text>
					<Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
						Freeze
					</Button>
				</Box>

				<Box>
					<Text my={1} fontWeight={"bold"}>
						Sort Feed
					</Text>
					<Text my={1}>You can Sort your account anytime by logging in.</Text>
					<Menu>
						<MenuButton
							colorScheme="red"
							as={Button}
							rightIcon={<ChevronDownIcon />}>
							Actions
						</MenuButton>
						<MenuList>
							<MenuItem onClick={() => handlesort("createdAt")}>
								Created Date Asc
							</MenuItem>
							<MenuItem onClick={() => handlesort("-createdAt")}>
								Created Date Dsc
							</MenuItem>
							<MenuItem onClick={() => handlesort("likes")}>Likes Asc</MenuItem>
							<MenuItem onClick={() => handlesort("-likes")}>
								Likes Dsc
							</MenuItem>
							<MenuItem onClick={() => handlesort("liked")}>Liked</MenuItem>
						</MenuList>
					</Menu>
				</Box>
			</Flex>
		</>
	);
};
