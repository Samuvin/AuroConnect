import express from "express";
import sendMail from "../controllers/mailController.js";
const Router = express.Router();
Router.post("/", sendMail);
export default Router;
