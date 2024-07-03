import {
	Button,
	Flex,
	Box,
	Link,
	useColorMode,
	useColorModeValue,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { PiWechatLogoBold } from "react-icons/pi";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { GiStrikingArrows } from "react-icons/gi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { PiUserSwitchFill } from "react-icons/pi";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	const bg = useColorModeValue("gray.100", "gray.900");
	const color = useColorModeValue("black", "white");
	const hoverBg = useColorModeValue("gray.200", "gray.800");

	return (
		<Flex
			justifyContent={"space-between"}
			alignItems="center"
			mt={6}
			mb="12"
			p={4}
			bg={bg}
			marginTop={0}
			borderRadius="md"
			boxShadow="lg">
			{user ? (
				<Tooltip label="Home" aria-label="Home Tooltip">
					<Link as={RouterLink} to="/">
						<IconButton
							icon={<AiFillHome size="1.7rem" />}
							aria-label="Home"
							variant="ghost"
							size="lg"
							color={color}
							_hover={{ bg: hoverBg }}
						/>
					</Link>
				</Tooltip>
			) : (
				<Button
					as={RouterLink}
					to={"/auth"}
					onClick={() => setAuthScreen("login")}
					variant="solid"
					colorScheme="teal"
					size="md">
					Login
				</Button>
			)}

			<Box
				w={7}
				h={7}
				display="flex"
				alignItems="center"
				justifyContent="center"
				cursor="pointer"
				marginLeft={20}
				onClick={toggleColorMode}
				_hover={{ transform: "scale(1.2)", transition: "0.2s" }}>
				<GiStrikingArrows size={30} color={color} />
			</Box>

			{user ? (
				<Flex alignItems={"center"} gap={4}>
					<Tooltip label="Profile" aria-label="Profile Tooltip">
						<Link as={RouterLink} to={`/${user.username}`}>
							<IconButton
								icon={<PiUserSwitchFill size="1.7rem" />}
								aria-label="Profile"
								variant="ghost"
								size="lg"
								color={color}
								_hover={{ bg: hoverBg }}
							/>
						</Link>
					</Tooltip>
					<Tooltip label="Chat" aria-label="Chat Tooltip">
						<Link as={RouterLink} to={`/chat`}>
							<IconButton
								icon={<PiWechatLogoBold size="1.7rem" />}
								aria-label="Chat"
								variant="ghost"
								size="lg"
								color={color}
								_hover={{ bg: hoverBg }}
							/>
						</Link>
					</Tooltip>
					<Tooltip label="Settings" aria-label="Settings Tooltip">
						<Link as={RouterLink} to={`/settings`}>
							<IconButton
								icon={<MdOutlineSettings size="1.7rem" />}
								aria-label="Settings"
								variant="ghost"
								size="lg"
								color={color}
								_hover={{ bg: hoverBg }}
							/>
						</Link>
					</Tooltip>
					<Tooltip label="Logout" aria-label="Logout Tooltip">
						<IconButton
							icon={<FiLogOut size="1.7rem" />}
							aria-label="Logout"
							variant="ghost"
							size="lg"
							onClick={logout}
							color={color}
							_hover={{ bg: "red.500", color: "white" }}
						/>
					</Tooltip>
				</Flex>
			) : (
				<Button
					as={RouterLink}
					to={"/auth"}
					onClick={() => setAuthScreen("signup")}
					variant="solid"
					colorScheme="teal"
					size="md">
					Sign up
				</Button>
			)}
		</Flex>
	);
};

export default Header;
