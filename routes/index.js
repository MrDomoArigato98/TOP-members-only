import express from "express";
const router = express.Router();
import * as controller from "../controllers/controller.js"


router.get("/", controller.getHome);

router.get("/sign-up", controller.getSignUpForm)
router.post("/sign-up", controller.postSignUpForm)

router.get("/log-in", controller.getLogInForm)
router.post("/log-in", controller.postLogInForm)


export function mountRoutes(app){
    app.use("/", router)
}