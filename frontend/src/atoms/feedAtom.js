import { atom } from "recoil";

const feedAtom = atom({
	key: "feedAtom",
	default: "createdAt",
});

export default feedAtom;
