import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Calendar from "./Calender";

const Contest = () => {
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	return (
		<Flex
			display={["none", "none", "flex"]}
			direction="column"
			gap={4}
			height="30rem"
			mt={"1.3rem"}
			width="20rem"
			p={4}
			borderRadius="md"
			overflowY={"scroll"}
			sx={{
				boxShadow:
					"rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
			}}
			mb={4}>
			<Text fontWeight="bold" mb={2} color={textColor}>
				<Calendar />
			</Text>
		</Flex>
	);
};

export default Contest;
