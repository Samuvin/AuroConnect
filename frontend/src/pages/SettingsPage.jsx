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
			</Flex>
		</>
	);
};
