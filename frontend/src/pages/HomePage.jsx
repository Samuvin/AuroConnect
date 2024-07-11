import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import Contest from "../components/Contest";
import feedAtom from "../atoms/feedAtom";
import axios from "axios";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
	const feedsort = useRecoilValue(feedAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await axios.get("/api/posts/feed", {
					params: { sort: feedsort, user_id: currentUser._id },
				});
				console.log(res.data);
				const data = res.data;
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap="10" alignItems={"flex-start"}>
			<Contest />
			<Box flex={70}>
				{!loading && posts.length === 0 && (
					<h1>Follow some users to see the feed</h1>
				)}

				{loading && (
					<Flex justify="center">
						<Spinner size="xl" />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
